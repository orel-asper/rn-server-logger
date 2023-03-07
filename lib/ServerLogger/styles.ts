
//@ts-nocheck
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flex: .05,
    },
    searchContainer: {
        flex: .07,
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        borderRadius: 5,
        paddingHorizontal: 10
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    logTypeButtonContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        marginHorizontal: 5
    },
    logsContainer: {
        flex: .8,
    },
    logContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 10
    },
    logTypeButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingBottom: 20
    },
    text: {
        fontSize: 10,
        color: '#444'
    },
    highlightedText: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#444'
    },
    emptyListContainer: {
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles;