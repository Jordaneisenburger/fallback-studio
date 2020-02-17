import React from 'react';
import { Link } from 'react-router-dom';

const MAGIC_ID = 'TABLE-OF-CONTENTS';

const TableOfContents = props => {
    const { sections } = props;

    const elements = Array.from(sections, section => {
        const [title, { fragment, id }] = section;

        // avoid linking to this section itself
        if (id.toUpperCase() === MAGIC_ID) {
            return null;
        }

        return (
            <li key={title}>
                <Link to={fragment}>{title}</Link>
            </li>
        );
    });

    return <ul>{elements}</ul>;
};

export default TableOfContents;
