import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Platform, ViewStyle } from "react-native";
import { CustomAlertProps } from "../@types/app";

const CustomAlert: React.FC<CustomAlertProps> = (props) => {

    var androidDefaults = {
        container: {
            backgroundColor: props.styleCustomAlert && props.styleCustomAlert.container && props.styleCustomAlert.container.backgroundColor ? props.styleCustomAlert.container.backgroundColor : '#FAFAFA',
        },
        title: {
            color: props.styleCustomAlert && props.styleCustomAlert.title && props.styleCustomAlert.title.color ? props.styleCustomAlert.title.color : '#000000',
            fontFamily: props.styleCustomAlert && props.styleCustomAlert.title && props.styleCustomAlert.title.fontFamily != null && props.styleCustomAlert.title.fontFamily != undefined ? props.styleCustomAlert.title.fontFamily : 'Bourton-inline',
            fontSize: props.styleCustomAlert && props.styleCustomAlert.title && props.styleCustomAlert.title.fontSize ? props.styleCustomAlert.title.fontSize : 22,
            fontWeight: props.styleCustomAlert && props.styleCustomAlert.title && props.styleCustomAlert.title.fontWeight ? props.styleCustomAlert.title.fontWeight : 'bold',
        },
        message: {
            color: props.styleCustomAlert && props.styleCustomAlert.message && props.styleCustomAlert.message.color ? props.styleCustomAlert.message.color : '#000000',
            fontFamily: props.styleCustomAlert && props.styleCustomAlert.message && props.styleCustomAlert.message.fontFamily ? props.styleCustomAlert.message.fontFamily : undefined,
            fontSize: props.styleCustomAlert && props.styleCustomAlert.message && props.styleCustomAlert.message.fontSize ? props.styleCustomAlert.message.fontSize : 15,
            fontWeight: props.styleCustomAlert && props.styleCustomAlert.message && props.styleCustomAlert.message.fontWeight ? props.styleCustomAlert.message.fontWeight : 'normal',
        },
        button: {
            color: '#387ef5',
            fontFamily: undefined,
            fontSize: 16,
            fontWeight: '500',
            textTransform: 'uppercase',
            backgroundColor: 'transparent',
        },
    };

    const AndroidButtonBox = () => {
        const [buttonLayoutHorizontal, setButtonLayoutHorizontal] = useState(1);
        const buttonProps = props.buttons && props.buttons.length > 0 ? props.buttons : [{}]

        return (
            <View 
                style={styles.androidButtonGroup}
                onLayout={(e) => e.nativeEvent.layout.height > 60 ? setButtonLayoutHorizontal(0) : null}
            >

                {
                    buttonProps.map((item, index) => {
                        if (index > 2) return null;
                        
                        let defaultButtonText = 'OK'

                        return (
                            <View key={index} style={[styles.androidButton, { borderColor: item.styles.borderColor ? item.styles.borderColor : '#000', width: `${(1 / buttonProps.length) * 100}%`, borderRightWidth: index % 2 == 0 && buttonProps.length > 1 ? 1 : 0 }]}>
                                <Pressable 
                                    onPress={
                                        (e) => {
                                            props.setModalVisible(false)
                                            if (item.onPress && typeof (item.onPress) === 'function') item.onPress(e);
                                        }
                                    }
                                    style={{ width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}
                                >
                                    <View 
                                        style={[{ backgroundColor: item.styles && item.styles.backgroundColor ? item.styles.backgroundColor : androidDefaults.button.backgroundColor }]}>
                                        <Text
                                            style={{
                                                color: (item.styles && item.styles.color) || androidDefaults.button.color,
                                                fontFamily: (item.styles && item.styles.fontFamily) || androidDefaults.button.fontFamily,
                                                fontSize: (item.styles && item.styles.fontSize) || androidDefaults.button.fontSize,
                                                fontWeight: (item.styles && item.styles.fontWeight) || androidDefaults.button.fontWeight,
                                                textTransform: (item.styles && item.styles.textTransform) || androidDefaults.button.textTransform
                                            }}
                                        >{item.text || defaultButtonText}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )
                    })

                }
            </View>
        );
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => props.onRequestClose}
        >
            <Pressable
                style={[styles.androidBackdrop, styles.backdrop]}
                onPress={
                    (e) => {
                        props.setModalVisible(false)
                        if (props.onRequestClose && typeof (props.onRequestClose) === 'function') props.onRequestClose(e);
                    }
                } 
            />
            <View style={styles.alertBox}>
                {
                    <View style={[styles.androidAlertBox, androidDefaults.container]}>
                        <Text style={[styles.androidTitle, androidDefaults.title]}>{props.title || 'Message'}</Text>
                        <Text style={[styles.androidMessage, androidDefaults.message]}>{props.message || ''}</Text>
                        <AndroidButtonBox />
                    </View>
                }
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    iOSBackdrop: {
        backgroundColor: "#000000",
        opacity: 0.3
    },
    androidBackdrop: {
        backgroundColor: "#232f34",
        opacity: 0.4
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    alertBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    androidAlertBox: {
        maxWidth: 280,
        width: '100%',
        margin: 48,
        elevation: 24,
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap'
    },
    androidTitle: {
        margin: 24,
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%'
    },
    androidMessage: {
        paddingHorizontal: 24,
        textAlign: 'justify',
        marginBottom: 24,
        width: '100%'
    },
    androidButtonGroup: {
        marginTop: 0,
        marginRight: 0,
        marginLeft: 0,
        marginBottom: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    androidButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderStyle: 'solid'
    },
    iOSAlertBox: {
        maxWidth: 270,
        width: '100%',
        zIndex: 10,
        borderRadius: 13,
    },
    iOSTitle: {
        paddingTop: 12,
        paddingRight: 16,
        paddingBottom: 7,
        paddingLeft: 16,
        marginTop: 8,
        textAlign: "center",
    },
    iOSMessage: {
        paddingTop: 0,
        paddingRight: 16,
        paddingBottom: 21,
        paddingLeft: 16,
        textAlign: "center"
    },
    iOSButtonGroup: {
        marginRight: -0.55
    },
    iOSButton: {

        borderTopColor: '#dbdbdf',
        borderTopWidth: 0.55,
        borderStyle: 'solid',
    },
    iOSButtonInner: {
        minHeight: 44,
        justifyContent: 'center'
    }
});

export default CustomAlert;