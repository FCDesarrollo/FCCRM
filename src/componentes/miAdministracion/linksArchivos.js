import React from "react";

import {
    PDFViewer,
    /* View, */
    Document,
    /* Page, */
    BlobProvider,
    usePDF,
    StyleSheet,
    Page,
    View,
    Text,
  } from "@react-pdf/renderer";

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });
  

const MyDoc = (
  <Document>
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text>Section #1</Text>
    </View>
    <View style={styles.section}>
      <Text>Section #2</Text>
    </View>
  </Page>
</Document>
  );

  function App() {
    return (
      <div >
        {/* <PDFViewer>
          <MyDocument />
        </PDFViewer> */}
        {/* Make a link to open the PDF in an ew tab using blob file */}
        <h1>Hello</h1>
        <BlobProvider document={MyDoc}>
          {({ url }) => (
            <a href={(url != null) ? url : ""} target="_blank">Preview</a>
          )}
        </BlobProvider>
  
      </div>
  
    );
  }
  
  /* const ViewReceipt = () => (
    <BlobProvider document={MyDoc}>
      {({ url }) => (
        <a className="button" href={url} target="_blank" rel="noopener noreferrer">
          Open in New Tab
        </a>
      )}
    </BlobProvider>
  ) */

  export default App;