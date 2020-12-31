import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, AppState, AppStateStatus, StyleSheet } from 'react-native';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import SongList from './SongList';
import ReadStoragePermissionBlockedError from '../Errors/Home/ReadStoragePermissionBlocked';
import ReadStoragePermissionDeniedError from '../Errors/Home/ReadStoragePermissionDenied';
import { checkReadStoragePermissionStatus } from '../../../controllers/permissions/storage';
import { updateStoragePermissionStatus } from '../../../actions/onboarding';
import {I_HomeProps, I_ReadExternalStoragePermissionStatusConfig, I_HomeStyles} from "./interfaces"
import { isEmptyArray } from '../../../util/util';
import NoSongsOnDevice from '../Errors/Home/NoSongsOnDevice';
import { I_SongSchema } from '../../../controllers/music/interfaces';
import { isThemeDark } from '../../../util/theme';
import { DARK_THEME, LIGHT_THEME } from '../../../constants/theme';

const ScrollableTabView = require('react-native-scrollable-tab-view');

interface I_GlobalStateProps {
  currentSong: null | I_SongSchema;
  theme: string;
}

const Home: React.FC<I_HomeProps> = (): JSX.Element => {
  const dispatch = useDispatch()

  const globalState: RootStateOrAny = useSelector((state: RootStateOrAny) => state);
  const readExternalStoragePermission: string = globalState.readExternalStoragePermission;

  const readExternalStoragePermissionStatus: I_ReadExternalStoragePermissionStatusConfig = {
    granted: readExternalStoragePermission === "granted",
    denied: readExternalStoragePermission === "denied",
    blocked: readExternalStoragePermission === "blocked"
  }

  const styles: I_HomeStyles = getStyles(globalState, readExternalStoragePermissionStatus);

  const RenderHomeView: React.FC<{}> = (): JSX.Element => {
    if (readExternalStoragePermissionStatus.denied) {
      return <ReadStoragePermissionDeniedError />
    } else if (readExternalStoragePermissionStatus.granted) {
      return (
        <ScrollableTabView tabBarUnderlineStyle={styles.scrollableTabView} tabBarTextStyle={styles.tabBarTextStyle}>
          <SongList tabLabel="Library" />
          <SongList tabLabel="Playlists" />
          <SongList tabLabel="Albums" />
        </ScrollableTabView>
      )
    } else if (readExternalStoragePermissionStatus.blocked) {
      return <ReadStoragePermissionBlockedError />
    } else {
      return <ActivityIndicator color={"#f05454"} />
    }
  }

  const appState = useRef<AppStateStatus>(AppState.currentState);

  const handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      await updateReadStoragePermissionStatus()
    }

    appState.current = nextAppState;
  };

  const updateReadStoragePermissionStatus = async (): Promise<void> => {
    let permissionStatus: string = await checkReadStoragePermissionStatus();
    dispatch(updateStoragePermissionStatus(permissionStatus))
  }

  useEffect(() => {
    (async (): Promise<void> => {
      let permissionStatus: string = await checkReadStoragePermissionStatus();
      dispatch(updateStoragePermissionStatus(permissionStatus))
    })()

    AppState.addEventListener("change", handleAppStateChange);

    return (): void => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  if(isEmptyArray(globalState.songs)){
    return <NoSongsOnDevice />
  }

  return (
    <SafeAreaView style={styles.container}>
      <RenderHomeView />
    </SafeAreaView>
  );
};

const getStyles = (state: RootStateOrAny, storagePermissionStatus: I_ReadExternalStoragePermissionStatusConfig): I_HomeStyles => {
  const {currentSong: showingPlayerFooter, theme}: I_GlobalStateProps = state;
  return StyleSheet.create<I_HomeStyles>({
    container: {
      justifyContent: storagePermissionStatus.granted ? undefined : "center",
      alignItems: storagePermissionStatus.granted ? undefined : "center",
      marginBottom: showingPlayerFooter ? 60 : 0,
      backgroundColor: isThemeDark(theme) ? DARK_THEME.primaryBg : LIGHT_THEME.primaryBg,
      marginTop: 0,
      flex: 1,
    },
    scrollableTabView: {
      backgroundColor: isThemeDark(theme) ? DARK_THEME.brightColor : LIGHT_THEME.brightColor
    },
    tabBarTextStyle: {
      color: isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt,
      fontFamily: "CircularStd-Book",
    }
  })
}

export default Home;