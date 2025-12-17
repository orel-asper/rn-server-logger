import { StyleSheet, useColorScheme } from 'react-native';

export const useStyles = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
      paddingTop: 30,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#ddd',
      paddingVertical: 10,
    },
    searchContainer: {
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      height: 40,
      borderColor: isDark ? '#555' : 'gray',
      borderWidth: 1,
      width: '90%',
      borderRadius: 5,
      paddingHorizontal: 10,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    title: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
    logTypeButtonContainer: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#bbb',
      borderRadius: 5,
      marginHorizontal: 5,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    activeLogTypeButtonContainer: {
      backgroundColor: isDark ? '#007AFF' : '#007AFF',
      borderColor: isDark ? '#007AFF' : '#007AFF',
    },
    logsContainer: {
      flex: 1,
    },
    logContainer: {
      padding: 10,
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#bbb',
      borderRadius: 5,
      marginBottom: 10,
      marginHorizontal: 10,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    logTypeButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333' : '#ddd',
      paddingBottom: 20,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    text: {
      fontSize: 10,
      color: isDark ? '#ccc' : '#444',
    },
    activeLogTypeButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    highlightedText: {
      fontSize: 10,
      color: '#fff',
      backgroundColor: isDark ? '#007AFF' : '#444',
      fontWeight: '600',
    },
    emptyListContainer: {
      height: 400,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? '#888' : '#666',
      textAlign: 'center',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
    },
    loadingText: {
      marginTop: 10,
      color: '#fff',
      fontSize: 14,
    },
  });
};

// Export default styles for backward compatibility
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
    paddingVertical: 10,
  },
  searchContainer: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logTypeButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeLogTypeButtonContainer: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  logsContainer: {
    flex: 1,
  },
  logContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  logTypeButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 20,
  },
  text: {
    fontSize: 10,
    color: '#444',
  },
  activeLogTypeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  highlightedText: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#444',
  },
  emptyListContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
  },
});

export default styles;
