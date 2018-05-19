'use strict';
const React = require('react');
const ReactNative = require('react-native');
import {
  CameraRoll,
  Image,
  Slider,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
  AppRegistry,
  Navigator,
  Modal,
  TouchableHighlight,
  Alert,
  AlertIOS,
  PickerIOS,
  TextInput,
  NavigatorIOS
} from 'react-native';

import { Container, Header, Title, Button, Left, Right, Body, Icon, Tab, Tabs, Footer, FooterTab } from 'native-base';

import { observer } from 'mobx-react/native';

import { ScreenshotOrganizer, Folder, Screenshot } from './Store';

import App from './App/App.js';
import FolderGrid from './App/FolderGrid.js';

let ScreenshotOrganizerStore = new ScreenshotOrganizer();

const ScreenshotOrganizerApp = observer(class ScreenshotOrganizerApp extends React.Component {

  constructor(props) {
    super(props);
    ScreenshotOrganizerStore.init();
    ScreenshotOrganizerStore.getFolderList();
    ScreenshotOrganizerStore.getPhotoListIOS();
  }

  render() {
    return (
      <Container>
        <Modal
          visible={ScreenshotOrganizerStore.photoPreviewOpen}
          animationType={'slide'}
          onRequestClose={() => {
            ScreenshotOrganizerStore.photoPreviewOpen = false;
          }}
        >
          <Container>
            <Header>
              <Left>
                <Button
                  onPress={() => ScreenshotOrganizerStore.photoPreviewOpen = false}
                  light
                  transparent
                >
                  <Icon
                    name='close'
                    style={{ color: 'black' }}
                  />
                </Button>
              </Left>
              <Body>
                <Title>Preview</Title>
              </Body>
              <Right>
              </Right>
            </Header>
            {
              (ScreenshotOrganizerStore.previewedImage.asset) ?
                <Image
                  resizeMode="contain"
                  style={{ position:'absolute',top: 100,left: 0,bottom: 0,right: 0 }}
                  source={{ uri: ScreenshotOrganizerStore.previewedImage.asset.uri }}
                />
                :
                <Text>
                  Nothing to preview
                  </Text>
            }
          </Container>
        </Modal>
        <MoveModal
          modalVisible={ScreenshotOrganizerStore.modalVisible}
          toggleModal={() => { ScreenshotOrganizerStore.toggleModalVisible() }}
          folderNames={ScreenshotOrganizerStore.folderList.map(folder => folder.title)}
          onSubmit={(folder) => { console.log(folder) }}
        />
        <Header>
          <Left>
            <Button onPress={() => AlertIOS.prompt(
              'New Folder',
              null,
              text => ScreenshotOrganizerStore.addFolder(text)
            )} transparent>
              <Icon name='ios-add' />
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>
            <Button onPress={() => ScreenshotOrganizerStore.toggleModalVisible()} transparent>
              <Text>Move</Text>
            </Button>
          </Right>
        </Header>
        <Tabs>
          <Tab heading="All">
            <App
              store={ScreenshotOrganizerStore}
              mediaList={ScreenshotOrganizerStore.mediaList}
              onSelectionChanged={(media, index, selected) => { ScreenshotOrganizerStore.selectScreenshot(media, index, selected) }}
              onOpenModal={(media) => {
                console.log("media", media);
                ScreenshotOrganizerStore.photoPreviewOpen = true;
                ScreenshotOrganizerStore.previewedImage = media;
              }}
              modalVisible={ScreenshotOrganizerStore.photoPreviewOpen}
            />
          </Tab>
          <Tab heading="Folders">
            <FolderGrid
              navigator={this.props.navigator}
              screenshotList={ScreenshotOrganizerStore.screenshotList}
              modalVisible={ScreenshotOrganizerStore.modalVisible}
              onSelectionChanged={(media, index, selected) => { ScreenshotOrganizerStore.selectScreenshot(media, index, selected) }}
              folderList={ScreenshotOrganizerStore.folderList}
              onFolderCreate={(text) => ScreenshotOrganizerStore.addFolder(text)}
              onFolderDetails={(folder) => ScreenshotOrganizerStore.getFolderDetails(folder)}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
})

const MoveModal = observer(class MoveModal extends React.Component {

  state = {
    selectedValue: "",
    text: ""
  }

  render() {
    let data = this.props.folderNames;
    const { query } = this.state;
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.props.modalVisible}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
          onRequestClose={() => { alert("Modal has been closed.") }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Header>
                <Left>
                  <Button onPress={() => ScreenshotOrganizerStore.toggleModalVisible()} transparent>
                    <Text>Cancel</Text>
                  </Button>
                </Left>
                <Body>
                  <Title>Move To Folder</Title>
                </Body>
                <Right>
                  <Button onPress={() => { ScreenshotOrganizerStore.addScreenshotListToFolder(this.state.selectedValue); ScreenshotOrganizerStore.toggleModalVisible() }} transparent>
                    <Text>Submit</Text>
                  </Button>
                </Right>
              </Header>
              <PickerIOS
                selectedValue={this.state.selectedValue}
                onValueChange={(selectedValue) => this.setState({ selectedValue })}>
                {data.map((title, index) => (
                  <PickerIOS.Item
                    key={index}
                    value={title}
                    label={title}
                  />
                ))}
              </PickerIOS>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
});

class NavigatorIOSApp extends React.Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ScreenshotOrganizerApp,
          title: 'My Initial Scene',
        }}
        navigationBarHidden={true}
        style={{ flex: 1 }}
      />
    );
  }
}

AppRegistry.registerComponent('screenshotOrganizer', () => NavigatorIOSApp);
