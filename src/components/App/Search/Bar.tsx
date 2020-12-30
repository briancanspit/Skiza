import React from 'react'
import { RootStateOrAny, useSelector } from 'react-redux';
import { Icon, Input, Item } from 'native-base'
import { StyleSheet, View } from 'react-native'
import {widthPercentageToDP as wdp} from 'react-native-responsive-screen';
import { I_BarProps, I_BarStyles } from './interfaces'

const Bar: React.FC<I_BarProps> = ({searchTerm, setSearchTerm}): JSX.Element => {
    const globalState: RootStateOrAny = useSelector((state: RootStateOrAny) => state);
    const onChangeText = (text: string): void => setSearchTerm(text)

    const styles: I_BarStyles = getStyles(globalState);
    return (
        <View style={styles.container}>
            <Item rounded style={styles.bar}>
                <Icon active name="search" />
                <Input placeholder="Artists, songs or albums" onChangeText={onChangeText} value={searchTerm} />
            </Item>
        </View>
    )
}

export default Bar

const getStyles = (state: RootStateOrAny): I_BarStyles => {
    return StyleSheet.create<I_BarStyles>({
        container: {
            top: 63
        },
        bar: {
            backgroundColor: "#f8f8f8",
            marginRight: wdp("5%"),
            marginLeft: wdp("5%"),
            top: 0
        }
    })
}
