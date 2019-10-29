const path = require('path');
const parentComponents = path.resolve(
    process.cwd() + '/../../pwa-studio/packages/venia-ui'
);

module.exports = componentOverride = {
    [`${parentComponents}/lib/components/Main`]: 'src/lib/components/Main',
    [`${parentComponents}/lib/components/Footer`]: 'src/lib/components/Footer'
};
