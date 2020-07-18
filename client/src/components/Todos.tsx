import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createProduct, deleteProduct, getProducts, patchProduct } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'

interface TodosProps {
  auth: Auth
  history: History
}

interface ProductState {
  products: Product[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, ProductState> {
  state: ProductState = {
    products: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/products/${productId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const description =   this.getProductDescription()
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        description
      })
      this.setState({
        products: [...this.state.products, newProduct],
        newTodoName: ''
      })

      this.componentDidMount()
    } catch (e) {
      alert(`Product Creation Failed: ${e.message}`)
      console.log(e) 
    }
  }

  onTodoDelete = async (productId: string) => {
    try {
      await deleteProduct(this.props.auth.getIdToken(), productId)
      this.setState({
        products: this.state.products.filter(todo => todo.productId != productId)
      })
    } catch {
      alert('Product deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.products[pos]
      await patchProduct(this.props.auth.getIdToken(), todo.productId, {
        name: todo.name,
        dueDate: todo.description,
        done: !todo.available
      })
      this.setState({
        products: update(this.state.products, {
          [pos]: { available: { $set: !todo.available } }
        })
      })
    } catch {
      alert('product deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const products = await getProducts(this.props.auth.getIdToken())
      this.setState({ products,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch product: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Product Catalogue Entry</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Product',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Add New Product..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Product
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.products.map((todo, pos) => {
          return (
            <Grid.Row key={todo.productId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.available}
                />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={8} floated="right">
                {todo.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.productId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.productId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  getProductDescription(): string {

    var textArray = [
      'A baked or cooked food that is typically small, flat and sweet',
      'Dairy product made from the fat and protein components of milk or cream',
      'Fresh Water from Mount Popa',
      'A Locally produce product',
      'Natural cholesterol lowering Medicie',
      'Medicine to cure the pain',
      'Mi Air Purifier',
      'Kithch tools',
      'Clitoria ternatea, commonly known as Asian pigeonwings, bluebellvine, blue pea'
  ];
      var randomNumber = Math.floor(Math.random()*textArray.length);
      return textArray[randomNumber] as string
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
