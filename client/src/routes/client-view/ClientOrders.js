import React from 'react';
import * as R from 'ramda';
import { Dropdown, Icon, Menu, Table } from '@8base/boost';
import { graphql } from 'react-apollo';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

import * as sharedGraphQL from 'shared/graphql';
import { calcSum } from 'shared/helpers';

let ClientOrders = ({ orders, history }) => {

  const viewOrder = (id, closeDropdown) => {
    history.push(`/order/${id}`);
    closeDropdown();
  };

  return (
    <Table>
      <Table.Header columns="repeat(5, 1fr) 60px">
        <Table.HeaderCell>Address</Table.HeaderCell>
        <Table.HeaderCell>Delivery Date</Table.HeaderCell>
        <Table.HeaderCell>Comment</Table.HeaderCell>
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell />
      </Table.Header>

      <Table.Body loading={orders.loading} data={R.pathOr([], ['ordersList', 'items'], orders)}>
        {(order) => (
          <Table.BodyRow columns="repeat(5, 1fr) 60px" key={order.id}>
            <Table.BodyCell>
              {R.pathOr('Unititled', ['address'], order)}
            </Table.BodyCell>
            <Table.BodyCell>
              {DateTime.fromISO(order.deliveryDate).toFormat('ff')}
            </Table.BodyCell>
            <Table.BodyCell>
              {order.comment || ''}
            </Table.BodyCell>
            <Table.BodyCell>
              {calcSum(R.pathOr([], ['order_Product', 'items'], order))}
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
                        <Menu.Item onClick={() => viewOrder(order.id, closeDropdown)}>View</Menu.Item>
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

ClientOrders.propTypes = {
  history: PropTypes.object.isRequired,
  id: PropTypes.string,
};

ClientOrders = compose(
  withRouter,
  graphql(
    sharedGraphQL.CLIENT_ORDERS_LIST_QUERY,
    {
      name: 'orders',
      options: (props) => ({
        variables: {
          id: props.id,
        },
      }),
    },
  )
)(ClientOrders);

export { ClientOrders };
