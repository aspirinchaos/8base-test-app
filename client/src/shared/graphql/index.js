import gql from 'graphql-tag';

export const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`;

export const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

export const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

export const CLIENTS_LIST_QUERY = gql`
  query ClientsList {
    clientsList {
      items {
        id
        firstName
        lastName
        email
        phone {
          code
          number
        }
        birthday
      }
    }
  }
`;


export const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_DELETE_MUTATION = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(data: { id: $id }) {
      success
    }
  }
`;

export const PRODUCTS_LIST_QUERY = gql`
  query ProductsList {
    productsList {
      items {
        id
        name
        description
        price
        picture {
          id
          downloadUrl
          shareUrl
        }
      }
    }
  }
`;


export const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

export const ORDERS_LIST_QUERY = gql`
  query OrdersList {
    ordersList {
      items {
        id
        deliveryDate
        address
        comment
        status
        client {
          firstName
          lastName
        }
        order_Product {
          items {
            price
            quantity
            id
          }
        }
      }
    }
  }
`;

export const ORDER_PRODUCTS_LIST_QUERY = gql`
  query OrderProductsList($id: ID!) {
    orders_ProductsList( filter: { order: { id: { equals: $id } } } ) {
      items {
        id
        price
        quantity
        product {
          name
          picture {
            id
            downloadUrl
          }
        }
      }
    }
  }
`;


export const CLIENT_ORDERS_LIST_QUERY = gql`
  query ClientOrdersList($id: ID!) {
    ordersList( filter: { client: { id: { equals: $id } } } ) {
      items {
        id
        deliveryDate
        address
        comment
        status
        order_Product {
          items {
            price
            id
            quantity
          }
        }
      }
    }
  }
`;

