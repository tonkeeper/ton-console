import { addons } from '@storybook/addons';

addons.setConfig({
  sidebar: {
    showRoots: false,
  },
});

const CSS_TO_HIDE_DEFAULT_CHAKRA_FROM_SIDEBAR = `
*[data-title="Chakra UI"],
*[aria-label="Hide Chakra UI stories"] {
  display: none !important;
}
`;

const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');
head.appendChild(style);
style.appendChild(
  document.createTextNode(CSS_TO_HIDE_DEFAULT_CHAKRA_FROM_SIDEBAR)
);

