import faceIcon from '../../../assets/images/avatar/sections/face.png';
import faceActiveIcon from '../../../assets/images/avatar/sections/face-active.png';
import headIcon from '../../../assets/images/avatar/sections/head.png';
import headActiveIcon from '../../../assets/images/avatar/sections/head-active.png';
import leftHandIcon from '../../../assets/images/avatar/sections/leftHand.png';
import leftHandActiveIcon from '../../../assets/images/avatar/sections/leftHand-active.png';
import rightHandIcon from '../../../assets/images/avatar/sections/rightHand.png';
import rightHandActiveIcon from '../../../assets/images/avatar/sections/rightHand-active.png';
import innerRingIcon from '../../../assets/images/avatar/sections/innerRingIcon.png';
import innerRingActiveIcon from '../../../assets/images/avatar/sections/innerRingActiveIcon.png';
import outerRingIcon from '../../../assets/images/avatar/sections/outerRingIcon.png';
import outerRingActiveIcon from '../../../assets/images/avatar/sections/outerRingActiveIcon.png';
import { hatsOrg as savedHeads, rightHandsOrg as savedLeftHands, leftHandsOrg as savedRightHands } from './assets';

let face = [];
let back = [];
let leftHand = [];
let rightHand = [];

let head = [];
let skin = [];

const path = '../../../assets/images/avatar/';

face = importAll(require.context('../../../assets/images/avatar/front', false, /\.png$/), `${path}front/`);
face = face.map((item, index) => ({ icon: item.default, id: index }));
// face = [...face, ...face, ...face];
back = importAll(require.context('../../../assets/images/avatar/back', false, /\.png$/), `${path}back/`);
back = back.map((item, index) => ({ icon: item.default, id: index }));

leftHand = savedLeftHands.map((item, index) => ({
  icon: typeof item === 'string' ? item : item.default,
  id: index
}));

rightHand = savedRightHands.map((item, index) => ({
  icon: typeof item === 'string' ? item : item.default,
  id: index
}));

head = savedHeads.map((item, index) => ({
  icon: typeof item === 'string' ? item : item.default,
  id: index
}));

skin = importAll(require.context('../../../assets/images/avatar/skins', false, /\.png$/), `${path}skins/`);
skin = skin.map((item, index) => ({ icon: item.default, id: index }));

export { face, back, leftHand, rightHand, head, skin };

export const sections = {
  face: {
    section: 'face',
    icon: faceIcon,
    activeIcon: faceActiveIcon,
    width: 36
  },
  head: {
    section: 'head',
    icon: headIcon,
    activeIcon: headActiveIcon,
    width: 60
  },
  leftHand: {
    section: 'leftHand',
    icon: leftHandIcon,
    activeIcon: leftHandActiveIcon,
    width: 60
  },
  rightHand: {
    section: 'rightHand',
    icon: rightHandIcon,
    activeIcon: rightHandActiveIcon,
    width: 60
  },
  innerRing: {
    section: 'innerRing',
    icon: innerRingIcon,
    activeIcon: innerRingActiveIcon,
    width: 60
  },
  outerRing: {
    section: 'outerRing',
    icon: outerRingIcon,
    activeIcon: outerRingActiveIcon,
    width: 60
  }
};

function importAll(r, path) {
  return r.keys().map(key => r(key));
}
