import React from 'react';
import { compose } from 'recompose';
import * as R from 'ramda';
import { Table, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { graphql } from 'react-apollo';
import { DateTime } from 'luxon';

import * as sharedGraphQL from 'shared/graphql';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';

let OrderTable = ({ orders, openModal, closeModal }) => {

  const onDelete = (id, closeDropdown) => {
    openModal(OrderDeleteDialog.id, { id });
    closeDropdown();
  };

  const calcSum = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Table>
      <Table.Header columns="repeat(6, 1fr) 60px">
        <Table.HeaderCell>Client</Table.HeaderCell>
        <Table.HeaderCell>Address</Table.HeaderCell>
        <Table.HeaderCell>Delivery Date</Table.HeaderCell>
        <Table.HeaderCell>Sum</Table.HeaderCell>
        <Table.HeaderCell>Comment</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell />
      </Table.Header>

      <Table.Body loading={orders.loading} data={R.pathOr([], ['ordersList', 'items'], orders)} action="Create Order" onActionClick={() => openModal(OrderCreateDialog.id)}>
        {(order) => (
          <Table.BodyRow columns="repeat(6, 1fr) 60px" key={order.id}>
            <Table.BodyCell>
              {`${R.pathOr('Unititled', ['client', 'firstName'], order)} ${R.pathOr('Unititled', ['client', 'lastName'], order)}`}
            </Table.BodyCell>
            <Table.BodyCell>
              {order.address}
            </Table.BodyCell>
            <Table.BodyCell>
              {DateTime.fromISO(order.deliveryDate).toFormat('ff')}
            </Table.BodyCell>
            <Table.BodyCell>
              {calcSum(R.pathOr([], ['order_Product', 'items'], order))}
            </Table.BodyCell>
            <Table.BodyCell>
              {order.comment}
            </Table.BodyCell>
            <Table.BodyCell>
              {order.status}
            </Table.BodyCell>
            <Table.BodyCell>
              <Dropdown defaultOpen={false}>
                <Dropdown.Head>
                  <Icon name="More" color="LIGHT_GRAY2" />
                </Dropdown.Head>
                <Dropdown.Body pin="right">
                  {
                    ({ closeDropdown }) => (
                      <Menu>
                        <Menu.Item onClick={() => onDelete(order.id, closeDropdown)}>Delete</Menu.Item>
                      </Menu>
                    )
                  }
                </Dropdown.Body>
              </Dropdown>
            </Table.BodyCell>
          </Table.BodyRow>
        )}
      </Table.Body>
    </Table>
  );
};

OrderTable = compose(
  withModal,
  graphql(sharedGraphQL.ORDERS_LIST_QUERY, { name: 'orders' }),
)(OrderTable);

export { OrderTable };
