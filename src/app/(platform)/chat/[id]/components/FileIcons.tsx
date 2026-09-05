import { FileText, FileSpreadsheet, File, FileImage, FileType2, FileCode, AudioLines } from 'lucide-react';

export const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'csv':
        case 'xls':
        case 'xlsx':
            return FileSpreadsheet;
        case 'txt':
            return FileText;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return FileImage;
        case 'pdf':
            return FileType2; // Or FileText
        case 'json':
        case 'js':
        case 'ts':
        case 'tsx':
        case 'jsx':
            return FileCode;
        case 'mp3':
        case 'wav':
        case 'ogg':
            return AudioLines;
        default:
            return File;
    }
};
