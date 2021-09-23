import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import ApplyRandomPrices from './ApplyRandomPrices';
// import Input from './Input'


import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Styling a regular HTML input
const StyledInput = styled.input`
  display: inline-block;
  margin: 24px 8px;
  padding: 8px;
  border: 1px solid black;
  border-radius: 4px;
  font-size: 16px;
`;

// GraphQL query that retrieves products by ID
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        tags
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

class ResourceListWithProducts extends React.Component {
  static contextType = Context;

  // A constructor that defines selected items and nodes
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      selectedNodes: {},
      tags: ""
    };
    this.tagNameChange = this.tagNameChange.bind(this);
  }

  tagNameChange(e) {
    this.setState({
      tags: e.target.value
    });
  }

  componentDidUpdate(){
    console.log("resource list...");
    console.log(this.state.tags);
  }

  render() {
    const app = this.context;

    // Returns products by ID
    return (
      <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: store.get('ids') }}>
          {({ data, loading, error, refetch }) => { // Refetches products by ID
            if (loading) return <div>Loading…</div>;
            if (error) return <div>{error.message}</div>;

            const nodesById = {};
            data.nodes.forEach(node => nodesById[node.id] = node);

            return (
              <>
                <Card>
                  <ResourceList
                    showHeader
                    resourceName={{ singular: 'Product', plural: 'Products' }}
                    items={data.nodes}
                    selectable
                    selectedItems={this.state.selectedItems}
                    onSelectionChange={selectedItems => {
                      const selectedNodes = {};
                      selectedItems.forEach(item => selectedNodes[item] = nodesById[item]);

                      return this.setState({
                        selectedItems: selectedItems,
                        selectedNodes: selectedNodes,
                      });
                    }}
                    renderItem={item => {
                      const media = (
                        <Thumbnail
                        source={
                          item.images.edges[0]
                          ? item.images.edges[0].node.originalSrc
                          : ''
                        }
                        alt={
                          item.images.edges[0]
                          ? item.images.edges[0].node.altText
                          : ''
                        }
                        />
                        );
                        const price = item.variants.edges[0].node.price;
                        return (
                          <ResourceList.Item
                          id={item.id}
                          media={media}
                          accessibilityLabel={`View details for ${item.title}`}
                          verticalAlignment="center"
                          onClick={() => {
                            let index = this.state.selectedItems.indexOf(item.id);
                            const node = nodesById[item.id];
                            if (index === -1) {
                              this.state.selectedItems.push(item.id);
                                this.state.selectedNodes[item.id] = node;
                              } else {
                                this.state.selectedItems.splice(index, 1);
                                delete this.state.selectedNodes[item.id];
                              }

                              this.setState({
                                selectedItems: this.state.selectedItems,
                                selectedNodes: this.state.selectedNodes,
                              });
                            }}
                            >
                          <Stack alignment="center">
                            <Stack.Item fill>
                              <FontAwesomeIcon icon={["fas", "tag"]} />
                                <StyledInput
                                  type="text"
                                  onChange={this.tagNameChange}
                                  {...StyledInput.value}
                                  placeholder="Enter new tag name"
                                />
                              <span>Tags: {`${item.tags}`}</span>
                              <h3>
                                <TextStyle variation="strong">
                                  {item.title}
                                </TextStyle>
                              </h3>
                            </Stack.Item>
                            <Stack.Item>
                              <p>${price}</p>
                            </Stack.Item>
                          </Stack>
                        </ResourceList.Item>
                      );
                    }}
                    />
                </Card>

              <ApplyRandomPrices selectedItems={this.state.selectedNodes} onUpdate={refetch} tags={this.state.tags} />
            </>
          );
        }}
      </Query>
    );
  }
}

export default ResourceListWithProducts;
