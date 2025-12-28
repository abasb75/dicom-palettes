import { glob } from 'glob';
import fs from 'fs';
import { parse } from '@abasb75/dicom-parser';

async function main() {
    const files = await glob('./dicoms/*.dcm');
    const results = [];

    for (const filePath of files) {
        const buffer = fs.readFileSync(filePath);
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        const dataset = await parse(arrayBuffer);

        const paletteData = dataset.getPaletteColorData();

        if (paletteData) {
            results.push({
                filePath,
                red: paletteData.red?.data ?? [],
                green: paletteData.green?.data ?? [],
                blue: paletteData.blue?.data ?? []
            });
        }
    }

    fs.writeFileSync('palettes.json', JSON.stringify(results, null, 2), 'utf-8');
    console.log('Palette data saved to palettes.json');
}

main().catch(console.error);
