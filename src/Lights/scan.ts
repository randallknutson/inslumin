const noble: any = require('@abandonware/noble');

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function (peripheral) {
  if (peripheral.advertisement?.localName?.startsWith('Triones')) {
    noble.stopScanning();
    console.log(`${peripheral.advertisement.localName} discovered (${peripheral.id} with address <${peripheral.address}, ${peripheral.addressType}>, connectable ${peripheral.connectable}, RSSI ${peripheral.rssi}:`);
    peripheral.connect((error) => {
      if (error) {
        console.log(error);
      }
      peripheral.discoverServices([], function (error, services) {
        if (error) {
          console.error(error);
          return;
        }

        services.forEach(function (service) {
          //
          // This must be the service we were looking for.
          //
          console.log('found service:', service.uuid);

          //
          // So, discover its characteristics.
          //
          service.discoverCharacteristics([], function (error, characteristics) {
            if (error) {
              console.error(error);
              return;
            }

            characteristics.forEach(function (characteristic) {
              //
              // Loop through each characteristic and match them to the
              // UUIDs that we know about.
              //
              console.log('found characteristics:', characteristic.uuid, `(${service.uuid})`);

            });
          });
        });

      })
    });
  }
});

setTimeout(() => {
  noble.stopScanning();
  process.exit();
}, 5000);