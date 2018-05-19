import React from "react";
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Button,
  Icon,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Header,
  Title
} from "native-base";
import {
  Image,
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  AlertIOS
} from "react-native";
import PhotoBrowser from "react-native-photo-browser";
import { observer } from "mobx-react/native";

const FolderDetail = observer(
  class FolderDetail extends React.Component {

    constructor(props) {
      super(props);
      this._onSelectionChanged = this._onSelectionChanged.bind(this);
    }
    _onSelectionChanged(media, index, selected) {
      this.props.onSelectionChanged(media, index, selected);
    }
    render() {
      let { folder, onBackPress, onMove } = this.props;
      let mediaList = folder.screenshotList.map(screenshot => {
        console.log(screenshot);
        return { photo: screenshot.photo, selected: screenshot.selected };
      });
      return (
        <Container>
          <Header>
            <Left>
              <Button onPress={onBackPress} transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{folder.title}</Title>
            </Body>
            <Right>
              <Button onPress={() => onMove(folder)} transparent>
                <Text>Move</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <PhotoBrowser
              mediaList={mediaList}
              displayActionButton={true}
              displayTopBar={false}
              renderTopBar={false}
              displaySelectionButtons={true}
              onSelectionChanged={this._onSelectionChanged}
              enableFullScreen={true}
              startOnGrid={false}
            />
          </Content>
        </Container>
      );
    }
  }
);

export default FolderDetail;
