
export function constructImageWithSrc(src: string) {
    const image = new Image();

    image.src = src;
    return image;
}
