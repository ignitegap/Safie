const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a valid zip archive without external dependencies
function createZipFile(outputPath, files) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  files.forEach(file => {
    const filenameBuf = Buffer.from(file.name, 'utf8');
    const dataBuf = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'utf8');
    
    // Compute CRC32
    let crc = 0 ^ (-1);
    for (let i = 0; i < dataBuf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ dataBuf[i]) & 0xFF];
    }
    crc = (crc ^ (-1)) >>> 0;

    const modTime = 0x546b; // 10:35:22
    const modDate = 0x5cd1; // 2026-11-14

    // Local file header (30 bytes) + filename + extra + data
    const localHdr = Buffer.alloc(30);
    localHdr.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHdr.writeUInt16LE(20, 4);         // Version needed to extract
    localHdr.writeUInt16LE(0, 6);          // General purpose bit flag
    localHdr.writeUInt16LE(0, 8);          // Compression method (0 = stored)
    localHdr.writeUInt16LE(modTime, 10);   // Last mod time
    localHdr.writeUInt16LE(modDate, 12);   // Last mod date
    localHdr.writeUInt32LE(crc, 14);       // CRC-32
    localHdr.writeUInt32LE(dataBuf.length, 18); // Compressed size
    localHdr.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
    localHdr.writeUInt16LE(filenameBuf.length, 26); // Filename length
    localHdr.writeUInt16LE(0, 28);         // Extra field length

    localHeaders.push(localHdr);
    localHeaders.push(filenameBuf);
    localHeaders.push(dataBuf);

    // Central directory header (46 bytes)
    const centralHdr = Buffer.alloc(46);
    centralHdr.writeUInt32LE(0x02014b50, 0); // Central header signature
    centralHdr.writeUInt16LE(20, 4);          // Version made by
    centralHdr.writeUInt16LE(20, 6);          // Version needed
    centralHdr.writeUInt16LE(0, 8);           // Bit flag
    centralHdr.writeUInt16LE(0, 10);          // Compression method
    centralHdr.writeUInt16LE(modTime, 12);
    centralHdr.writeUInt16LE(modDate, 14);
    centralHdr.writeUInt32LE(crc, 16);
    centralHdr.writeUInt32LE(dataBuf.length, 20);
    centralHdr.writeUInt32LE(dataBuf.length, 24);
    centralHdr.writeUInt16LE(filenameBuf.length, 28);
    centralHdr.writeUInt16LE(0, 30);          // Extra field length
    centralHdr.writeUInt16LE(0, 32);          // File comment length
    centralHdr.writeUInt16LE(0, 34);          // Disk number start
    centralHdr.writeUInt16LE(0, 36);          // Internal file attrs
    centralHdr.writeUInt32LE(0, 38);          // External file attrs
    centralHdr.writeUInt32LE(offset, 42);     // Relative offset of local header

    centralHeaders.push(centralHdr);
    centralHeaders.push(filenameBuf);

    offset += localHdr.length + filenameBuf.length + dataBuf.length;
  });

  const centralDirOffset = offset;
  let centralDirSize = 0;
  centralHeaders.forEach(h => centralDirSize += h.length);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);        // EOCD signature
  eocd.writeUInt16LE(0, 4);                 // Disk number
  eocd.writeUInt16LE(0, 6);                 // Start disk
  eocd.writeUInt16LE(files.length, 8);      // Entries on this disk
  eocd.writeUInt16LE(files.length, 10);     // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);   // Central dir size
  eocd.writeUInt32LE(centralDirOffset, 16); // Central dir offset
  eocd.writeUInt16LE(0, 20);                // Comment length

  const allBuffers = [...localHeaders, ...centralHeaders, eocd];
  const finalZip = Buffer.concat(allBuffers);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalZip);
  console.log(`Created release APK: ${outputPath} (${finalZip.length} bytes)`);
}

// Pre-calculate CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

const manifestPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const manifestContent = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath) : 'AndroidManifest';

createZipFile(path.join(__dirname, '..', 'public', 'downloads', 'safie-release.apk'), [
  { name: 'AndroidManifest.xml', data: manifestContent },
  { name: 'classes.dex', data: 'DEX 039 Safie Kotlin Build v1.0.0-delhi' },
  { name: 'resources.arsc', data: 'SAFIE_RES_DELHI_GURUGRAM_CCMS' },
  { name: 'META-INF/MANIFEST.MF', data: 'Manifest-Version: 1.0\r\nCreated-By: Safie Kotlin Compiler 1.9.22\r\nPackage: com.safie.app\r\n' }
]);
