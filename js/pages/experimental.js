const nbt = window.nbt;

$('#levelpicker').on('change', ()=>{
    const file = $('#levelpicker').prop('files')[0];
    console.log(file)
    if(!file) return;

    var reader = new FileReader();
    reader.onload = () =>{
        nbt.parse(reader.result, (error, data) => {
            if (error) throw error
            
            console.log('Loaded nbt file, data:', data)

            try{
                // Patch
                const levelDat = data.value.Data.value;
                levelDat.enabled_features = {
                    "type": "list",
                    "value": {
                        "type": "string",
                        "value": [
                            "minecraft:update_1_21",
                            "minecraft:bundle",
                            "minecraft:trade_rebalance",
                            "minecraft:vanilla"
                        ]
                    }
                }

                // Enable
                const datapacks = levelDat.DataPacks.value;
                if(datapacks.Enabled.value.type == "string"){
                    const enabled = datapacks.Enabled.value.value;
                    if(!enabled.includes("bundle")) enabled.push("bundle");
                    if(!enabled.includes("update_1_21")) enabled.push("update_1_21");
                    if(!enabled.includes("trade_rebalance")) enabled.push("trade_rebalance");
                } else { 
                    datapacks.Enabled.value = {
                        "type": "string",
                        "value": [
                            "vanilla",
                            "bundle",
                            "trade_rebalance",
                            "update_1_21"
                        ]
                    }
                }

                // Save
                nbt.writeCompressed(data, (error, compressed) => {
                    if (error) throw error;
                    saveFile(compressed.buffer, file.name, "application/octet-stream");
                });
            } catch (error) {
                console.error(error);
            }

        });
    };
    reader.readAsArrayBuffer(file);
})


async function saveFile(plaintext, fileName, fileType) {
    return new Promise((resolve, reject) => {
      const dataView = new DataView(plaintext);
      const blob = new Blob([dataView], { type: fileType });
  
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
        return resolve();
      } else if (/iPhone|fxios/i.test(navigator.userAgent)) {
        // This method is much slower but createObjectURL
        // is buggy on iOS
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          if (reader.error) {
            return reject(reader.error);
          }
          if (reader.result) {
            const a = document.createElement('a');
            // @ts-ignore
            a.href = reader.result;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
          }
          resolve();
        });
        reader.readAsDataURL(blob);
      } else {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);
        setTimeout(resolve, 100);
      }
    });
  }
