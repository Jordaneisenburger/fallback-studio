import React, { Component, Suspense } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import Button from 'src/components/Button';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import Carousel from 'src/components/ProductImageCarousel';
import Quantity from 'src/components/ProductQuantity';
import RichText from 'src/components/RichText';
import defaultClasses from './productFullDetail.css';
import appendOptionsToPayload from 'src/util/appendOptionsToPayload';
import findMatchingVariant from 'src/util/findMatchingProductVariant';

const Options = React.lazy(() => import('../ProductOptions'));

class ProductFullDetail extends Component {
    static propTypes = {
        classes: shape({
            cartActions: string,
            description: string,
            descriptionTitle: string,
            details: string,
            detailsTitle: string,
            imageCarousel: string,
            options: string,
            productName: string,
            productPrice: string,
            quantity: string,
            quantityTitle: string,
            root: string,
            title: string
        }),
        product: shape({
            id: number,
            sku: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        currency: string.isRequired,
                        value: number.isRequired
                    })
                }).isRequired
            }).isRequired,
            media_gallery_entries: arrayOf(
                shape({
                    label: string,
                    position: number,
                    disabled: bool,
                    file: string.isRequired
                })
            ),
            description: string
        }).isRequired,
        addToCart: func.isRequired
    };

    static getDerivedStateFromProps(props, state) {
        const { configurable_options } = props.product;
        const optionCodes = new Map(state.optionCodes);

        // if this is a simple product, do nothing
        if (!Array.isArray(configurable_options)) {
            return null;
        }

        // otherwise, cache attribute codes to avoid lookup cost later
        for (const option of configurable_options) {
            optionCodes.set(option.attribute_id, option.attribute_code);
        }

        return { optionCodes };
    }

    state = {
        optionCodes: new Map(),
        optionSelections: new Map(),
        quantity: 1
    };

    setQuantity = quantity => this.setState({ quantity });

    addToCart = () => {
        const { props, state } = this;
        const { optionSelections, quantity, optionCodes } = state;
        const { addToCart, product } = props;
        const { configurable_options } = product;
        const isConfigurable = Array.isArray(configurable_options);
        const productType = isConfigurable
            ? 'ConfigurableProduct'
            : 'SimpleProduct';

        const payload = {
            item: product,
            productType,
            quantity
        };

        if (productType === 'ConfigurableProduct') {
            appendOptionsToPayload(payload, optionSelections, optionCodes);
        }

        addToCart(payload);
    };

    handleSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    };

    get fallback() {
        return loadingIndicator;
    }

    get productOptions() {
        const { fallback, handleSelectionChange, props } = this;
        const { configurable_options } = props.product;
        const isConfigurable = Array.isArray(configurable_options);

        if (!isConfigurable) {
            return null;
        }

        return (
            <Suspense fallback={fallback}>
                <Options
                    options={configurable_options}
                    onSelectionChange={handleSelectionChange}
                />
            </Suspense>
        );
    }

    get mediaGalleryEntries() {
        const { props, state } = this;
        const { product } = props;
        const { optionCodes, optionSelections } = state;
        const {
            configurable_options,
            media_gallery_entries,
            variants
        } = product;

        const isConfigurable = Array.isArray(configurable_options);

        if (
            !isConfigurable ||
            (isConfigurable && optionSelections.size === 0)
        ) {
            return media_gallery_entries;
        }

        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        if (!item) {
            return media_gallery_entries;
        }

        return item.product.media_gallery_entries;
    }

    render() {
        const { productOptions, props, mediaGalleryEntries } = this;
        const { classes, product } = props;
        const { regularPrice } = product.price;

        // We want this key to change whenever mediaGalleryEntries changes.
        // Make it dependent on a unique value in each entry (file),
        // and the order.
        const carouselKey = mediaGalleryEntries.reduce((fullKey, entry) => {
            return `${fullKey},${entry.file}`;
        }, '');

        return (
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        <span>{product.name}</span>
                    </h1>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={regularPrice.amount.currency}
                            value={regularPrice.amount.value}
                        />
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    <Carousel images={mediaGalleryEntries} key={carouselKey} />
                </section>
                <section className={classes.options}>{productOptions}</section>
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>
                        <span>Quantity</span>
                    </h2>
                    <Quantity
                        initialValue={this.state.quantity}
                        onValueChange={this.setQuantity}
                    />
                </section>
                <section className={classes.cartActions}>
                    <Button priority="high" onClick={this.addToCart}>
                        <span>Add to Cart</span>
                    </Button>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <span>Product Description</span>
                    </h2>
                    <RichText content={product.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>
                        <span>SKU</span>
                    </h2>
                    <strong>{product.sku}</strong>
                </section>
            </Form>
        );
    }
}

export default classify(defaultClasses)(ProductFullDetail);
