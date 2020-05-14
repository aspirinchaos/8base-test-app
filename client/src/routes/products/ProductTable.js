import React from 'react';
import { compose } from 'recompose';
import * as R from 'ramda';
import { Table, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';

import { ProductCreateDialog } from './ProductCreateDialog';
import { ProductEditDialog } from './ProductEditDialog';
import { ProductDeleteDialog } from './ProductDeleteDialog';

let ProductTable = ({ products, openModal, closeModal }) => (
  <Table>
    <Table.Header columns="repeat(5, 1fr) 60px">
      <Table.HeaderCell>Picture</Table.HeaderCell>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Description</Table.HeaderCell>
      <Table.HeaderCell>Price</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Header>

    <Table.Body
      loading={products.loading}
      data={R.pathOr([], ['productsList', 'items'], products)}
      action="Create Product"
      onActionClick={() => openModal(ProductCreateDialog.id)}
    >
      {(product) => (
        <Table.BodyRow columns="repeat(5, 1fr) 60px" key={product.id}>
          <Table.BodyCell>
            {product.picture &&
            <img src={R.pathOr('Unititled', ['picture', 'downloadUrl'], product)} alt="" style={{
              width: '5rem',
              height: '5rem',
            }} />}
          </Table.BodyCell>
          <Table.BodyCell>
            {R.pathOr('Unititled', ['name'], product)}
          </Table.BodyCell>
          <Table.BodyCell>
            {R.pathOr('Unititled', ['description'], product)}
          </Table.BodyCell>
          <Table.BodyCell>
            {R.pathOr('Unititled', ['price'], product)}
          </Table.BodyCell>
          <Table.BodyCell>
            <Dropdown defaultOpen={false}>
              <Dropdown.Head>
                <Icon name="More" color="LIGHT_GRAY2" />
              </Dropdown.Head>
              <Dropdown.Body pin="right">
                {({ closeDropdown }) => (
                  <Menu>
                    <Menu.Item onClick={() => {
                      openModal(ProductEditDialog.id, { initialValues: product });
                      closeDropdown();
                    }}>
                      Edit
                    </Menu.Item>
                    <Menu.Item onClick={() => {
                      openModal(ProductDeleteDialog.id, { id: product.id });
                      closeDropdown();
                    }}>
                      Delete
                    </Menu.Item>
                  </Menu>
                )}
              </Dropdown.Body>
            </Dropdown>
          </Table.BodyCell>
        </Table.BodyRow>
      )}
    </Table.Body>
  </Table>
);

ProductTable = compose(
  withModal,
  graphql(sharedGraphQL.PRODUCTS_LIST_QUERY, { name: 'products' }),
)(ProductTable);

export { ProductTable };
