/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Field } from 'Util/Query';

/** @namespace Query/ProductCompare */
export class ProductCompare {
    getQuery(guestCartId = null) {
        const field = new Field('compareProducts');

        if (guestCartId) {
            field.addArgument('guestCartId', 'String', guestCartId);
        }

        return field.addFieldList(this._getQueryFields());
    }

    getAddProductToCompareMutation(productSku, guestCartId = null) {
        const field = new Field('addProductToCompare')
            .addArgument('product_sku', 'String!', productSku);

        if (guestCartId) {
            field.addArgument('guestCartId', 'String', guestCartId);
        }

        return field;
    }

    getRemoveComparedProductMutation(productSku, guestCartId = null) {
        const field = new Field('removeComparedProduct')
            .addArgument('product_sku', 'String!', productSku);

        if (guestCartId) {
            field.addArgument('guestCartId', 'String', guestCartId);
        }

        return field;
    }

    getClearComparedProductsMutation(guestCartId = null) {
        const field = new Field('clearComparedProducts');

        if (guestCartId) {
            field.addArgument(guestCartId);
        }

        return field;
    }

    _getQueryFields() {
        return [
            'count',
            this._getProductsField()
        ];
    }

    _getProductsField() {
        return new Field('products')
            .addFieldList(this._getProductsFields());
    }

    _getProductsFields() {
        return [
            'id',
            'name'
        ];
    }
}

export default new ProductCompare();
