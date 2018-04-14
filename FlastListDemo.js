import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { List, ListItem, SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];
export class flatListDemo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            dropdown_4_options: null,
            dropdown_4_defaultValue: 'loading...',
            dropdown_6_icon_heart: true,
        }
    }
    componentDidMount = () => {
        this.makeRemoteRequest()
        this._dropdown_4&&   this._dropdown_4.hide()
    };
    makeRemoteRequest = () => {
        const { page, seed } = this.state
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`
        this.setState({ loading: true })
        setTimeout(() => {
            fetch(url).then(res => res.json()).then(res => {
                this.setState({
                    data: page === 1 ? res.results : [...this.state.data, ...res.results],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                })
            }).catch(error => {
                this.setState({ error, loading: false })
            })
        }, 1500);


    }

    handleRefresh = () => {
        this.setState({
            page: 1,
            seed: this.state.seed + 1,
            refreshing: true
        }, () => {
            this.makeRemoteRequest()
        })
    }
    handerLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.makeRemoteRequest()
        })
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '86%',
                    backgroundColor: "#CED0CE",
                    marginLeft: '14%'
                }}

            />
        )
    }
    renderHeader = () => {
        return <SearchBar placeholder="Type Here ..." lightTheme round />
    }
    renderFooter = () => {
        if (!this.state.loading) return null
        return (
            <View style={{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: "#CED0CE"
            }}>
                <ActivityIndicator animating size="large" />
            </View>
        )
    }

    _dropdown_4_willShow() {
        setTimeout(() => this.setState({
            dropdown_4_options: DEMO_OPTIONS_1,
            dropdown_4_defaultValue: 'loaded',
        }), 500);
    }

    _dropdown_4_willHide() {
        this.setState({
            dropdown_4_options: null,
            dropdown_4_defaultValue: 'loading',
        });
        this._dropdown_4.hide()
    }

    _dropdown_4_onSelect(idx, value) {
        // BUG: alert in a modal will auto dismiss and causes crash after reload and touch. @sohobloo 2016-12-1
        //alert(`idx=${idx}, value='${value}'`);
        console.debug(`idx=${idx}, value='${value}'`);
    }

    onPressItem = (item) => {
      // alert(JSON.stringify(item))
        this._dropdown_4 && this._dropdown_4.show()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => { this.onPressItem(item)}}>
                        <ListItem
                            roundAvatar
                            title={`${item.name.first} ${item.name.last}`}
                            subtitle={item.email}
                            avatar={{ uri: item.picture.thumbnail }}
                            containerStyle={{ borderBottomWidth: 0 }}
                        />
                        </TouchableWithoutFeedback>
                    )}

                    keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.handerLoadMore}
                    onEndReachedThreshold={50}
                />
                    
            </List>  
                <ModalDropdown ref={el => this._dropdown_4 = el} style={styles.dropdown_4}
                    disabled={false}
                    dropdownStyle={styles.dropdown_4_dropdown}
                    options={this.state.dropdown_4_options}
                   // options={null}
                    defaultIndex={-1}
                    defaultValue={this.state.dropdown_4_defaultValue}
                    onDropdownWillShow={this._dropdown_4_willShow.bind(this)}
                    onDropdownWillHide={this._dropdown_4_willHide.bind(this)}
                    onSelect={(idx, value) => this._dropdown_4_onSelect(idx, value)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dropdown_5: {
        margin: 8,
        zIndex: -100,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
    },
    dropdown_4: {
        //marginTop: 30,
        position : 'absolute',
        margin: 8,
        zIndex: 100,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
    },
    dropdown_4_dropdown: {
        width: 100,
        zIndex: 100,
    },
})

export default flatListDemo;
