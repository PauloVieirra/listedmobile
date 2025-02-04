import React from 'react';
import { useGlobalContext } from '../../Context/Contexto';
import Icon from 'react-native-vector-icons/FontAwesome';

export const PencilAlt = (props) => {
  const { themeName } = useGlobalContext();

  return (
    <Icon
      name="pencil"
      size={24}
      color={themeName === 'light' ? '#000' : '#fff'} // Cor baseada no tema
      {...props}
    />
  );
};

export const BaselineMenu = (props) => {
  const { themeName } = useGlobalContext();

  return (
    <Icon
      name="bars"
      size={24}
      color={themeName === 'light' ? '#000' : '#fff'}
      {...props}
    />
  );
};

export const BaselineAlternateEmail = (props) => {
  const { themeName } = useGlobalContext();

  return (
    <Icon
      name="envelope"
      size={24}
      color={themeName === 'light' ? '#000' : '#fff'}
      {...props}
    />
  );
};

export const Password = (props) => {
  const { themeName } = useGlobalContext();
  return (
    <Icon
      name="lock"
      size={24}
      color={themeName === 'light' ? '#000' : '#fff'}
      {...props}
    />
  );
};

export const Sun = (props) => {
  return (
    <Icon
      name="sun-o"
      size={24}
      color="#FFAC33"
      {...props}
    />
  );
};

export function MoonSolid(props) {
  return (
    <Icon
      name="moon-o"
      size={24}
      color="#FFAC33"
      {...props}
    />
  );
};

export function BaselineCameraAlt(props) {
  return (
    <Icon
      name="camera"
      size={32}
      color="currentColor"
      {...props}
    />
  );
};

export function CheckmarkCircle16(props) {
  return (
    <Icon
      name="check-circle"
      size={32}
      color="#52D17C"
      {...props}
    />
  );
}

export function HeartColurfull(props) {
  return(
    <Icon
    name="heart"
    size={32}
    color={'rgb(253, 79, 79)'}
    {...props}
    />
  );
}

export function Heartline(props) {
  return(
    <Icon
    name="heart-o"
    size={32}
    color={'rgb(245, 245, 245)'}
    {...props}
    />
  );
}
