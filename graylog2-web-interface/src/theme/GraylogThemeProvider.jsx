/* eslint-disable camelcase */
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import { breakpoints, fonts, utils } from 'theme';
import colors from 'theme/colors';
import buttonStyles from 'components/graylog/styles/buttonStyles';
import CombinedProvider from 'injection/CombinedProvider';
import CustomizationContext from 'contexts/CustomizationContext';
import aceEditorStyles from 'components/graylog/styles/aceEditorStyles';

import { CUSTOMIZATION_THEME_MODE, THEME_MODE_LIGHT } from './constants';

const { CustomizationsActions } = CombinedProvider.get('Customizations');

const GraylogThemeProvider = ({ children }) => {
  useEffect(() => {
    CustomizationsActions.get(CUSTOMIZATION_THEME_MODE);
  }, []);

  const themeMode = useContext(CustomizationContext)[CUSTOMIZATION_THEME_MODE];
  const mode = themeMode?.theme_mode || THEME_MODE_LIGHT;

  if (!colors[mode]) { return null; }

  return (
    <ThemeProvider theme={{
      mode,
      breakpoints,
      colors: colors[mode],
      fonts,
      components: {
        button: buttonStyles({ colors: colors[mode] }),
        aceEditor: aceEditorStyles({ colors: colors[mode] }),
      },
      utils: {
        ...utils,
        colorLevel: utils.colorLevel(colors[mode]),
        readableColor: utils.readableColor(colors[mode]),
      },
    }}>
      {children}
    </ThemeProvider>
  );
};

GraylogThemeProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default GraylogThemeProvider;
