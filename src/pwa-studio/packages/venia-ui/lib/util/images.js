import { resourceUrl } from '@magento/venia-drivers';

/**
 * This is specific to the Venia store-front sample data.
 */
export const DEFAULT_WIDTH_TO_HEIGHT_RATIO = 4 / 5;

export const imageWidths = new Map(
    Object.entries({
        ICON: 40,
        THUMBNAIL: 80,
        SMALL: 160,
        REGULAR: 320,
        LARGE: 640,
        LARGER: 960,
        XLARGE: 1280,
        XXLARGE: 1600,
        XXXLARGE: 2560
    })
);

export const generateUrl = (imageURL, mediaBase) => (width, height) =>
    resourceUrl(imageURL, {
        type: mediaBase,
        width,
        height,
        fit: 'cover'
    });

export const generateUrlFromContainerWidth = (
    imageURL,
    containerWidth,
    type = 'image-product'
) => {
    const intrinsicWidth = window.devicePixelRatio * containerWidth;
    /**
     * Find the best width that is closest to the intrinsicWidth.
     */
    const actualWidth = Array.from(imageWidths, ([, value]) => value).reduce(
        (prev, curr) => {
            if (prev) {
                return Math.abs(intrinsicWidth - curr) <
                    Math.abs(intrinsicWidth - prev)
                    ? curr
                    : prev;
            } else {
                return curr;
            }
        },
        null
    );

    return generateUrl(imageURL, type)(
        actualWidth,
        actualWidth / DEFAULT_WIDTH_TO_HEIGHT_RATIO
    );
};

export const generateSrcset = (imageURL, type) => {
    if (!imageURL || !type) return '';

    const generateSrcsetUrl = generateUrl(imageURL, type);

    return Array.from(imageWidths, ([, value]) => value)
        .map(
            width =>
                `${generateSrcsetUrl(
                    width,
                    width / DEFAULT_WIDTH_TO_HEIGHT_RATIO
                )} ${width}w`
        )
        .join(',\n');
};
