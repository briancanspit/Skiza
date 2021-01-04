import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import Modal from 'react-native-modal'
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStateOrAny, useSelector, connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { I_PlayerModalProps, I_PlayerModalStyles } from './interfaces'
import { setSongPlayingStatus, togglePlayerModal } from '../../../actions/music';
import { isThemeDark } from '../../../util/theme';
import { DARK_THEME, LIGHT_THEME } from '../../../constants/theme';
import { deduceCoverArtToUse, showToast } from '../../../util/songs';
import { I_SongSchema } from '../../../controllers/music/interfaces';
import { MUSICAL_NOTE_IMAGE } from '../../../assets/images';
import { isNullUndefined } from '../../../util/util';
import { I_SongStateInitialProps } from '../../../reducers/player/songState';

interface I_GlobalStateProps {
    theme: string;
    showPlayerModal: boolean;
    currentSong: I_SongSchema;
    songState: I_SongStateInitialProps;
}

interface I_AdditionalProps extends I_PlayerModalProps {
    togglePlayerModal: (show: boolean) => Promise<void>;
    setSongPlayingStatus: (song: I_SongSchema | undefined | null, status: boolean) => Promise<void>;
}

type T_Props = I_PlayerModalProps & I_AdditionalProps;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const PlayerModal: React.FC<T_Props> = ({togglePlayerModal, setSongPlayingStatus}): JSX.Element => {
    const globalState: RootStateOrAny = useSelector((state: RootStateOrAny) => state);
    const {showPlayerModal, theme, currentSong, songState}: I_GlobalStateProps = globalState;

    const closeModal = (): void => {
        togglePlayerModal(false);
    }

    const playSong = (): void => {
        setSongPlayingStatus(currentSong, true);
    }

    const pauseSong = (): void => {
        setSongPlayingStatus(currentSong, false);
    }

    const toggleShuffle = (): void => {
        showToast("Shuffle: On")
    }

    useEffect(() => {
        if(isNullUndefined(currentSong)){
            closeModal();
        }
    }, [])
    
    const styles: I_PlayerModalStyles = getStyles(globalState);

    return (
        <Modal
            onBackButtonPress={closeModal}
            onSwipeComplete={closeModal}
            deviceHeight={SCREEN_HEIGHT}
            isVisible={showPlayerModal}
            deviceWidth={SCREEN_WIDTH}
            swipeDirection={"down"}
            useNativeDriver={false}
            style={styles.modal}
        >
            <View style={styles.container}>
                <View style={styles.topView}>
                    <IoniconsIcon name={"chevron-down"} size={30} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} onPress={closeModal} />
                    <Text style={styles.barTitle}>
                        Now Playing
                    </Text>
                    <MaterialCommunityIcon name={"dots-vertical"} size={30} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} />
                </View>
                <View style={styles.middleView}>
                    <Image source={deduceCoverArtToUse(currentSong.cover, MUSICAL_NOTE_IMAGE)} style={styles.coverArt} />
                </View>
                <View style={styles.bottomView}>
                    <Text style={styles.song} numberOfLines={1}>
                        {currentSong.title}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {currentSong.author}
                    </Text>
                    <View style={styles.progressBar}></View>
                    <View style={styles.buttonsView}>
                        <IoniconsIcon name={"shuffle"} size={25} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} onPress={toggleShuffle} />
                        <MaterialCommunityIcon name={"skip-previous"} size={50} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} />
                        <IoniconsIcon name={songState.playing ? "pause-circle-outline" : "play-circle-outline"} size={65} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} onPress={songState.playing ? pauseSong : playSong} />
                        <MaterialCommunityIcon name={"skip-next"} size={50} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} />
                        <MaterialCommunityIcon name={"repeat"} size={25} color={isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt} />
                    </View>
                    <View style={styles.placeholderView}></View>
                </View>
            </View>
        </Modal>
    )
}

const mapStateToProps = () => {
    return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        togglePlayerModal: (show: boolean) => dispatch(togglePlayerModal(show)),
        setSongPlayingStatus: (song: I_SongSchema | undefined | null, status: boolean) => dispatch(setSongPlayingStatus(song, status)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerModal)

const getStyles = (state: RootStateOrAny): I_PlayerModalStyles => {
    const {theme}: I_GlobalStateProps = state;
    return StyleSheet.create<I_PlayerModalStyles>({
        modal: {
            margin: 0
        },
        container: {
            backgroundColor: isThemeDark(theme) ? DARK_THEME.secondaryBg : LIGHT_THEME.secondaryBg,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            width: SCREEN_WIDTH,
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
            
        },
        topView: {
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "stretch",
            paddingTop: 20,
        },
        downCaret: {},
        barTitle: {
            color: isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt,
            fontFamily: "CircularStd-Bold",
            fontSize: 20
        },
        options: {},
        middleView: {
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30
        },
        coverArt: {
            resizeMode: 'cover',
            height: 300,
            width: SCREEN_WIDTH - 70,
        },
        bottomView: {
            width: SCREEN_WIDTH - 70
        },
        song: {
            color: isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt,
            fontFamily: "CircularStd-Bold",
            fontSize: 18,
            paddingTop: 2,
            paddingBottom: 4,
        },
        artist: {
            color: isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt,
            fontFamily: "CircularStd-Book",
            fontSize: 16,
            paddingTop: 5,
            paddingBottom: 2
        },
        progressBar: {
            backgroundColor: isThemeDark(theme) ? DARK_THEME.primaryTxt : LIGHT_THEME.primaryTxt,
            marginTop: 20,
            marginBottom: 30,
            height: 1,
        },
        buttonsView: {
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20
        },
        shuffle: {},
        previous: {},
        play: {},
        next: {},
        repeat: {},
        placeholderView: {
            height: 40
        }
    })  
}