export const verificarExtensionArchivo = fileName => {
    const extensionesPermitidas = /(.jpg|.jpeg|.png|.doc|.docx|.rtf|.prn|.dif|.slk|.xps|.pdf|.txt|.csv|.xlsx|.xlsm|.xlsb|.xltx|.xltm|.xls|.xlt|.xls|.xml|.xlam|.xla|.xlw|.XLR)$/i;
    return extensionesPermitidas.exec(fileName);
}

export const verificarArchivoCer = fileName => {
    const extensionesPermitidas = /(.cer)$/i;
    return extensionesPermitidas.exec(fileName);
}

export const verificarArchivoKey = fileName => {
    const extensionesPermitidas = /(.key)$/i;
    return extensionesPermitidas.exec(fileName);
}