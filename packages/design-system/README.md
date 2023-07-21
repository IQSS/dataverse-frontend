## Dataverse Design System - React Components

The Dataverse Design System is an open-source project that provides a comprehensive collection of reusable React components for building user interfaces. This package serves as a library of UI components specifically designed for use in the Dataverse Frontend.

## Features

- **Ready-to-use React components**: The package offers React components that follow the Dataverse design guidelines. These components enable developers to quickly and easily create consistent and visually appealing user interfaces.

- **Consistent design and styling**: The components in the Dataverse Design System adhere to a cohesive design language, ensuring a consistent and harmonious look and feel throughout the application. The styling follows best practices and can be easily customized to match your project's branding requirements.

- **Modular and extensible**: The design system's components are built with modularity and extensibility in mind. Each component is self-contained, allowing for easy integration into new or existing projects. Developers can leverage the components as building blocks, combining them to create complex interfaces while maintaining a clean and scalable codebase.

- **Responsive and accessible**: The components are designed to be responsive and accessible, ensuring that the user interface functions well on various devices and is inclusive for all users. They comply with web accessibility standards, making it easier to create inclusive and usable experiences for individuals with disabilities.

- **Documentation and examples in Storybook**: The Dataverse Design System package includes documentation, providing usage guidelines and examples for each component in the integrated [Storybook](https://646fbe232a8d3b501a1943f3-euwxbewiys.chromatic.com).

[//]: # '- **Active community and support**: Coming soon!'

## Installation

You can install the Dataverse Design System package via npm:

```shell
npm install @iqss/dataverse-design-system
```

## Usage

To use the components from the Dataverse Design System in your React application, import the desired components and start building your UI:

```jsx
import { Container, Row, Col, Form } from '@iqss/dataverse-design-system'

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Hello Dataverse!</h1>
          <Form>
            <Form.Group controlId="username">
              <Form.Group.Label>Username</Form.Group.Label>
              <Form.Group.Input type="text" placeholder="Username" />
            </Form.Group>
            <Form.Group controlId="basic-form-password">
              <Form.Group.Label>Password</Form.Group.Label>
              <Form.Group.Input type="password" placeholder="Password" />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default App
```

For detailed usage instructions and available customization options, refer to the [Storybook](https://646fbe232a8d3b501a1943f3-euwxbewiys.chromatic.com) provided with the package.

[//]: # 'COMMING SOON'
[//]: # '## Contributions'
[//]: #
[//]: # "The Dataverse Design System is an open-source project and welcomes contributions from the community. Whether you find a bug, have a feature request, or would like to contribute code improvements, your participation is highly encouraged. Please refer to the project's GitHub repository for guidelines on how to contribute."
[//]: #
[//]: # "Join the Dataverse community and let's build better user interfaces together!"
[//]: #
[//]: # '**License:** [MIT License](https://opensource.org/licenses/MIT)'
