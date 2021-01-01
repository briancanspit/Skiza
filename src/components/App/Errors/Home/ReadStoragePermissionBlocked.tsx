import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { RootStateOrAny, useSelector } from 'react-redux';
import { openSettings } from 'react-native-permissions';
import { I_ReadStoragePermissionBlockedProps, I_ReadStoragePermissionBlockedStyles } from './interfaces'
import { HOME_FOLDER_ERROR_ANIMATION } from '../../../../assets/animations';
import { isThemeDark } from '../../../../util/theme';
import { DARK_THEME, LIGHT_THEME, SHARED_THEME } from '../../../../constants/theme';

interface I_GlobalStateProps {
    theme: string;
}

const ReadStoragePermissionBlocked: React.FC<I_ReadStoragePermissionBlockedProps> = (): JSX.Element => {
    const folderAnimation = HOME_FOLDER_ERROR_ANIMATION;
    const globalState: RootStateOrAny = useSelector((state: RootStateOrAny) => state);

    const invokeSettingsOpen = (): void => {
        openSettings()
    }

    const styles: I_ReadStoragePermissionBlockedStyles = getStyles(globalState);

    return (
        <View style={styles.container}>
            <LottieView
                source={folderAnimation}
                style={styles.LottieView}
                autoPlay={true}
            />
            <Text style={styles.screenText}>
                Dang, there's a problem.
            </Text>
            <Text style={styles.screenText}>
                Please allow Skiza to access your external storage.
            </Text>
            <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={invokeSettingsOpen}>
                <Text style={styles.buttonText}>Open Settings</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ReadStoragePermissionBlocked;

const getStyles = (state: RootStateOrAny): I_ReadStoragePermissionBlockedStyles => {
    const {theme}: I_GlobalStateProps = state;
    return StyleSheet.create<I_ReadStoragePermissionBlockedStyles>({
        container: {
            justifyContent: "center",
            alignItems: "center",
            flex: 1
        },
        LottieView: {
            height: 80,
            width: 80,
            marginBottom: 10
        },
        screenText: {
            fontFamily: "CircularStd-Book",
            fontSize: 15,
            paddingLeft: 20,
            paddingRight: 20,
            color: isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt
        },
        button: {
            alignItems: "center",
            backgroundColor: isThemeDark(theme) ? SHARED_THEME.brightTextLv2 : SHARED_THEME.brightTextLv2,
            padding: 14,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            marginTop: 20
        },
        buttonText: {
            fontFamily: "CircularStd-Book",
            fontSize: 15,
            color: isThemeDark(theme) ? SHARED_THEME.lightTextLv1 : SHARED_THEME.lightTextLv1
        }
    })
}