import React, { Component } from 'react';
import CategoryList from 'parentSrc/components/CategoryList';

export default class CMS extends Component {
    render() {
        return <CategoryList title="Shop by category" id={2} />;
    }
}
