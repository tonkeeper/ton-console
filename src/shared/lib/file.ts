export async function imageUrlToFilesList(image: string): Promise<FileList> {
    const response = await fetch(image);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    return dataTransfer.files;
}
