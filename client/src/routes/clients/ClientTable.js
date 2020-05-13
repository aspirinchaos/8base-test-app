import React from 'react';
import { compose } from 'recompose';
import * as R from 'ramda';
import { Table, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { graphql } from 'react-apollo';
import { DateTime } from 'luxon';

import * as sharedGraphQL from 'shared/graphql';

import { ClientCreateDialog } from './ClientCreateDialog';
import { ClientEditDialog } from './ClientEditDialog';
import { ClientDeleteDialog } from './ClientDeleteDialog';

let ClientTable = ({ clients, openModal, closeModal }) => (
  <Table>
    <Table.Header columns="repeat(5, 1fr) 60px">
      <Table.HeaderCell>First Name</Table.HeaderCell>
      <Table.HeaderCell>Last Name</Table.HeaderCell>
      <Table.HeaderCell>Email</Table.HeaderCell>
      <Table.HeaderCell>Phone</Table.HeaderCell>
      <Table.HeaderCell>Birthday</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Header>

    <Table.Body loading={ clients.loading } data={ R.pathOr([], ['clientsList', 'items'], clients) } action="Create Client" onActionClick={() => openModal(ClientCreateDialog.id)}>
      {
        (client) => (
          <Table.BodyRow columns="repeat(5, 1fr) 60px" key={ client.id }>
            <Table.BodyCell>
              { client.firstName }
            </Table.BodyCell>
            <Table.BodyCell>
              { client.lastName }
            </Table.BodyCell>
            <Table.BodyCell>
              { client.email }
            </Table.BodyCell>
            <Table.BodyCell>
              +{ client.phone.code }{ client.phone.number }
            </Table.BodyCell>
            <Table.BodyCell>
              { DateTime.fromISO(client.birthday).toFormat('dd/mm/yyyy') }
            </Table.BodyCell>
            <Table.BodyCell>
              <Dropdown defaultOpen={ false }>
                <Dropdown.Head>
                  <Icon name="More" color="LIGHT_GRAY2" />
                </Dropdown.Head>
                <Dropdown.Body pin="right">
                  {
                    ({ closeDropdown }) => (
                      <Menu>
                        <Menu.Item onClick={ () => { openModal(ClientEditDialog.id, { initialValues: client }); closeDropdown(); } }>Edit</Menu.Item>
                        <Menu.Item onClick={ () => { openModal(ClientDeleteDialog.id, { id: client.id }); closeDropdown(); } }>Delete</Menu.Item>
                      </Menu>
                    )
                  }
                </Dropdown.Body>
              </Dropdown>
            </Table.BodyCell>
          </Table.BodyRow>
        )
      }
    </Table.Body>
  </Table>
);

ClientTable = compose(
  withModal,
  graphql(sharedGraphQL.CLIENTS_LIST_QUERY, { name: 'clients' }),
)(ClientTable);

export { ClientTable };
