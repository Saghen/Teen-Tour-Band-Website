interface IColor {
  default: string
  text: string
  textFaded: string
  textColor?: string
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

interface IColors {
  primary: IColor
  secondary: IColor
  background: IColor
  backgroundInverted: IColor
  red: IColor
  green: IColor
}

const colors: IColors = {
  primary: {
    default: '#e6222c',
    text: '#fff',
    textFaded: '#888',
    textColor: '#e6222c',
    50: '#ffeaed',
    100: '#ffcad0',
    200: '#f09596',
    300: '#e76a6d',
    400: '#f04548',
    500: '#f52f2c',
    600: '#e6222c',
    700: '#d41426',
    800: '#c7041f',
    900: '#b90011'
  },
  secondary: {
    default: '#135180',
    text: '#fff',
    textFaded: '#888',
    textColor: '#1c70a2',
    50: '#e1f4fa',
    100: '#b3e2f2',
    200: '#84cfea',
    300: '#5abce1',
    400: '#3faedc',
    500: '#2ca0d7',
    600: '#2693c9',
    700: '#1f80b6',
    800: '#1c70a2',
    900: '#135180'
  },
  background: {
    default: '#fff',
    text: '#000',
    textFaded: '#888',
    50: '#fff',
    100: '#fafafa',
    200: '#f5f5f5',
    300: '#f0f0f0',
    400: '#dedede',
    500: '#c2c2c2',
    600: '#b3b3b3',
    700: '#a6a6a6',
    800: '#999999',
    900: '#808080'
  },
  backgroundInverted: {
    default: '#1b1d24',
    text: '#fff',
    textFaded: '#888',
    50: '#353741',
    100: '#32353e',
    200: '#30323b',
    300: '#2E3038',
    400: '#2A2C33',
    500: '#23252C',
    600: '#1d1e24',
    700: '#1b1d24',
    800: '#16171d',
    900: '#121317'
  },
  red: {
    default: '#e6222c',
    text: '#fff',
    textFaded: '#888',
    textColor: '#e6222c',
    50: '#ffeaed',
    100: '#ffcad0',
    200: '#f09596',
    300: '#e76a6d',
    400: '#f04548',
    500: '#f52f2c',
    600: '#e6222c',
    700: '#d41426',
    800: '#c7041f',
    900: '#b90011'
  },
  green: {
    default: '#22e622',
    text: '#000',
    textFaded: '#888',
    textColor: '#22e622',
    50: '#ecfde8',
    100: '#cff9c6',
    200: '#adf5a0',
    300: '#84f075',
    400: '#5deb50',
    500: '#22e622',
    600: '#00d418',
    700: '#00bf07',
    800: '#00aa00',
    900: '#008700'
  }
}

export { colors }

export * from '../../shared/constants'
