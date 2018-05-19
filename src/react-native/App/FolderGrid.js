import React, { Component } from "react";
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
  Header
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
import { observer } from "mobx-react/native";
import FolderDetail from "./FolderDetail";

const FolderGrid = observer(
  class FolderGrid extends Component {
    constructor(props) {
      super(props);
      this._onSelectionChanged = this._onSelectionChanged.bind(this);
      this._onActionButton = this._onActionButton.bind(this);
      this._onSelectFolder = this._onSelectFolder.bind(this);
    }

    _onSelectionChanged(media, index, selected) {
      console.log(
        `${media.photo} selection status: ${selected} index:${index}`
      );
    }

    _onActionButton(media, index) {}

    _onSelectFolder(folder) {
      let navigator = this.props.navigator;
      this.props.onFolderDetails(folder);
      navigator.push({
        component: FolderDetail,
        passProps: {
          folder: folder,
          onBackPress: () => {
            navigator.pop();
          },
          onSelectionChanged:(media,index,selected)=>{
            this.props.onSelectionChanged(media,index,selected);
          },
          onMove: folder => {
            
          }
        },
        title: folder.title
      });
    }

    render() {
      let { folderList, screenshotList } = this.props;
      return (
        <Container>
          {folderList.length > 0 ? (
            <Content>
              <List>
                {folderList.map((folder, index) => {
                  return (
                    <ListItem
                      button
                      key={index}
                      onPress={() => {
                        this._onSelectFolder(folder);
                      }}
                    >
                      {folder.thumbnail ? (
                        <Thumbnail
                          square
                          style={{
                            width: 50,
                            height: 50,
                            resizeMode: "contain"
                          }}
                          size={80}
                          source={folder.thumbnail}
                        />
                      ) : (
                        <Thumbnail
                          square
                          size={80}
                          source={require("../img/empty-box.png")}
                        />
                      )}
                      <Body>
                        <Text>{folder.title}</Text>
                        <Text note>
                          {folder.screenshotList
                            ? folder.screenshotList.length
                            : 0}{" "}
                          Photos
                        </Text>
                      </Body>
                      <Right>
                        <Icon name="arrow-forward" />
                      </Right>
                    </ListItem>
                  );
                })}
              </List>
            </Content>
          ) : (
            <Container
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 50
              }}
            >
              <Button
                onPress={() =>
                  AlertIOS.prompt("New Folder", null, text =>
                    this.props.onFolderCreate(text)
                  )
                }
              >
                <Text>Create Folder</Text>
              </Button>
            </Container>
          )}
        </Container>
      );
    }
  }
);

const styles = StyleSheet.create({
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row",
    justifyContent: "center"
  },
  image: {
    margin: 4,
    width: 100,
    height: 100
  }
});

export default FolderGrid;
