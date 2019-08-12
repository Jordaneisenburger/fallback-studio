import { connect } from '@magento/venia-drivers';
import { toggleDrawer } from 'parentSrc/actions/app';
import CategoryContent from './categoryContent';

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(toggleDrawer('filter'))
});

export default connect(
    null,
    mapDispatchToProps
)(CategoryContent);
