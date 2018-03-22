import React, { Component } from 'react';
import { ListView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import ListItem from './ListItem';
import { selectAbsen, absenFetch } from '../actions';


class AbsenList extends Component {
  componentWillMount() {
    this.props.absenFetch();
    
    console.log('absenlist props will mount', this.props);
    
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('absenlist props will receive', nextProps);
    this.createDataSource(nextProps);
  }

  createDataSource({ absens }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(absens);
  }

  renderRow(rowData, sectionId, rowId) {
    return <ListItem absenUserId={rowId} absen={rowData} />;
  }

  render() {
    return (
    <View>
        <View style={{ flexDirection: 'row', padding: 5 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', paddingRight: 5, paddingLeft: 5, flex: 3 }}>Nama</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', paddingRight: 5, paddingLeft: 5, flex: 2 }}>Masuk</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', paddingRight: 5, paddingLeft: 5, flex: 2 }}>Pulang</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', paddingRight: 5, paddingLeft: 5, flex: 2 }}>Durasi</Text>
        </View>
        <ListView 
          enableEmptySections
          dataSource={this.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { absens: state.absenList };
};

export default connect(mapStateToProps, { selectAbsen, absenFetch })(AbsenList);
