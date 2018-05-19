import React, { PropTypes } from 'react';
import {
  Dimensions,
  ListView,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';

import Constants from './constants';
import { Photo } from './media';

// 1 margin and 1 border width
const ITEM_MARGIN = 2;

export default class GridContainer extends React.Component {

  static propTypes = {
    style: View.propTypes.style,
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    displaySelectionButtons: PropTypes.bool,
    onPhotoTap: PropTypes.func,
    itemPerRow: PropTypes.number,

    /*
    * refresh the list to apply selection change
    */
    onMediaSelection: PropTypes.func,
  };

  static defaultProps = {
    displaySelectionButtons: false,
    onPhotoTap: () => {},
    itemPerRow: 3,
  };

  constructor(props, context) {
    super(props, context);

    this._renderRow = this._renderRow.bind(this);
    this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);

    this.state = {};
  }

  _renderRow(media: Object, sectionID: number, rowID: number) {
    const {
      displaySelectionButtons,
      onPhotoTap,
      onMediaSelection,
      itemPerRow,
      onLoadMore,
      canLoadMore,
      onLongPress
    } = this.props;
    let _onLongPress = onLongPress;
    const screenWidth = Dimensions.get('window').width;
    const photoWidth = (screenWidth / itemPerRow) - (ITEM_MARGIN * 2);
    if(media.deleted){
      return null;
    }
    return (
      <TouchableHighlight key={rowID} onLongPress={()=>_onLongPress(media)} onPress={() => onPhotoTap(rowID,!media.selected)}>
        <View style={styles.row}>
          <Photo
            width={photoWidth}
            height={100}
            resizeMode={'cover'}
            thumbnail
            progressImage={require('../Assets/hourglass.png')}
            displaySelectionButtons={displaySelectionButtons}
            uri={media.thumb || media.photo}
            selected={media.selected}
            onSelection={(isSelected) => {
              onMediaSelection(rowID, isSelected);
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  _loadMoreContentAsync = async ()=>{
    this.props.onLoadMore();
  }

  render() {
    const { dataSource, canLoadMore, onLoadMore, onLongPress } = this.props;
    return (
      <View style={styles.container}>
        <ListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          contentContainerStyle={styles.list}
          dataSource={dataSource}
          initialListSize={21}
          onLongPress={onLongPress}
          pageSize={3}
          scrollRenderAheadDistance={500}
          renderRow={this._renderRow}
          removeClippedSubviews={false}
          canLoadMore={canLoadMore}
          onLoadMoreAsync={this._loadMoreContentAsync}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 180,
  },
  list: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    justifyContent: 'center',
    margin: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 1,
  },
});
