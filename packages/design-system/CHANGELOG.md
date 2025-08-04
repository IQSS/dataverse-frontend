# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# Non Published Changes

- **DropdownButton:**
  - Add `customToggle` prop to allow custom toggle components.
  - Add `customToggleClassname` and `customToggleMenuClassname` props to allow custom styling of the custom toggle dropdown wrapper and menu.
  - Add `align` prop to control the alignment of the dropdown menu.

# [2.0.2](https://github.com/IQSS/dataverse-frontend/compare/@iqss/dataverse-design-system@2.0.1...@iqss/dataverse-design-system@2.0.2) (2024-06-23)

### Bug Fixes

- Update package.json to properly expose TypeScript types via the exports field.

# [2.0.1](https://github.com/IQSS/dataverse-frontend/compare/@iqss/dataverse-design-system@2.0.0...@iqss/dataverse-design-system@2.0.1) (2024-06-21)

- Update Storybook link in README.md.

# [2.0.0](https://github.com/IQSS/dataverse-frontend/compare/@iqss/dataverse-design-system@1.1.0...@iqss/dataverse-design-system@2.0.0) (2024-06-20)

### Features

- **Card:** add Card to the Design System.
- **ProgressBar:** add ProgressBar to the Design System.
- **SelectAdvanced:** add SelectAdvanced to the Design System.
- **FormRadioGroup:** add FormRadioGroup to the Design System.
- **FormRadio:** add FormRadio to the Design System.
- **Stack:** add Stack to the Design System.
- **TransferList:** add TransferList to the Design System.
- **Spinner:** add Spinner to the Design System.
- **CloseButton:** add CloseButton to the Design System.
- **Offcanvas:** add Offcanvas to the Design System.
- **RichTextEditor:** add RichTextEditor to the Design System.

### Improvements

- **Accordion:**
  - extend Props Interface to accept HTML Attributes props.
  - ability to forward react ref.
- **AccordionBody:** extend Props Interface to accept HTML Attributes, `bsPrefix` and `as` props.
- **AccordionHeader:** extend Props Interface to accept HTML Attributes, `onClick`, `bsPrefix` and `as` props.
- **AccordionItem:** extend Props Interface to accept HTML Attributes, `bsPrefix` and `as` props.
- **FormChecboxGroup:** refactor styles.
- **FormGroupWithMultipleFields:**
  - refactor styles and conditional render logic.
  - remove withDynamicFields prop and remove logic to handle adding or removing fields.
- **FormGroup:**
  - ability to clone children wrapped by react fragments.
  - controlId is now optional.
  - remove the required and fieldIndex props, remove the cloning of child elements to pass them the withinMultipleFieldsGroup and required props.
- **FormCheckbox:**
  - ability to forward react ref to input and export FormCheckboxProps interface.
  - modify Props Interface to allow any react node as `label` prop.
- **FormInput:**
  - ability to forward react ref to input and export FormInputProps interface.
  - remove withinMultipleFieldsGroup prop.
  - extend Props Interface to accept `autoFocus` and `type: 'search'` prop.
- **FormSelect:**
  - ability to forward react ref to input, add `isInvalid` `isValid` & `disabled` props and export FormSelectProps interface.
  - remove withinMultipleFieldsGroup prop.
  - extend Props Interface to accept `autoFocus` prop.
- **FormTextArea:**
  - ability to forward react ref to input and export FormTextAreaProps interface.
  - remove withinMultipleFieldsGroup prop.
  - extend Props Interface to accept `autoFocus` prop.
  - modify Props Interface to allow `rows` prop.
- **FormFeedback:**
  - remove `span: 9` from styles.
  - remove withinMultipleFieldsGroup prop.
- **FormLabel:**
  - extend Props Interface to accept `htmlFor` prop.
  - remove withinMultipleFieldsGroup prop extend interface to accept ColProps.
- **DropdownButton:** extend Props Interface to accept `ariaLabel` prop.
- **DropdownButtonItem:** extend Props Interface to accept `as` prop.
- **DynamicFieldsButtons:** Removed from design system.
- **FormText:** remove withinMultipleFieldsGroup prop.
- **FormInputGroup:**
  - remove hasVisibleLabel prop and accepts className prop.
  - extend Props Interface to accept `hasValidation` prop to properly show rounded corners in an <InputGroup> with validation.
- **Tab:** extend Props Interface to accept `disabled` prop to disable the tab.
- **NavbarDropdownItem:** Now accepts `as` prop and takes `as` Element props.
- **Button:** extend Props Interface to accept `size` prop and variant `danger`.
- **Table:** extend Props Interface to accept `bordered`, `borderless` and `striped`.

### ⚠️ Note on Breaking Changes

Due to the amount of time since the last release and the significant number of new features introduced as part of the ongoing Dataverse project, this new version may include breaking changes. These could affect component behavior—especially in form-related components—and involve modifications to props or their expected usage.
For this reason, the version has been bumped from 1.1.0 directly to 2.0.0.

# [1.1.0](https://github.com/IQSS/dataverse-frontend/compare/@iqss/dataverse-design-system@1.0.1...@iqss/dataverse-design-system@1.1.0) (2024-03-12)

### Bug Fixes

- **Icon-only Button:** add aria-label ([1f17e84](https://github.com/IQSS/dataverse-frontend/commit/1f17e84edf50c6780f8854f28e214386d9b5dc05))
- **ButtonGroup:** add className ([c295c7b](https://github.com/IQSS/dataverse-frontend/commit/c295c7b914759c37f705b511381dc3e878f55684))
- **ButtonGroup:** fix styles when using tooltips ([3edfaef](https://github.com/IQSS/dataverse-frontend/commit/3edfaef4f931a6a0b511b09d2a3326371c867f6d))
- **Tooltip:** avoid layout shift on hover ([a52c3dc](https://github.com/IQSS/dataverse-frontend/commit/a52c3dc972642f6b4e39ef1ed795300a8c5e6528))
- **Table:** vertically align cells content to the middle ([0f3a335](https://github.com/IQSS/dataverse-frontend/commit/0f3a3352afb3de77d34c634473c46502a415a20b))
- **Table:** change alignment cells ([fcf89a0](https://github.com/IQSS/dataverse-frontend/commit/fcf89a078ed2d09eac0f3d6673e45efc3445fabe))
- **styles:** remove absolute path from design system bootstrap imports ([2dddb07](https://github.com/IQSS/dataverse-frontend/commit/2dddb07e11b6d0abf8ac70c70d991173463cc5eb))
- **Storybook:** set fixed package.json dependencies ([c58dfd1](https://github.com/IQSS/dataverse-frontend/commit/c58dfd143e4ac46dc3507ffe737b663530fd3f35))
- **Storybook:** accessibility violation fixed ([1aa62b0](https://github.com/IQSS/dataverse-frontend/commit/1aa62b0e7f9108f132995c501836baae0811870a))
- **Icons:** fix icons not appearing ([72d6bb5](https://github.com/IQSS/dataverse-frontend/commit/72d6bb5fcc518f50fbf2543f0a33a5d0561dbbc5))
- **DropdownButton:** refactor to also work as a select ([c1171c1](https://github.com/IQSS/dataverse-frontend/commit/c1171c1c0e149fc81811d3469ec046f6b6c3f928))
- **Dropdown:** add disabled property ([d4a32f1](https://github.com/IQSS/dataverse-frontend/commit/d4a32f10ea6d9e94f7e149886f1044e68afc53dd))
- **DropdownButtonItem:** add disabled property ([0f2a626](https://github.com/IQSS/dataverse-frontend/commit/0f2a626c7201c90b35ec05823e56efc21be82bcd))
- **ButtonGroup:** add HTMLAttributes ([821d38f](https://github.com/IQSS/dataverse-frontend/commit/821d38ff53a73dc4f478854e275781d933d920b5))
- **Button:** add type attribute ([b2c31a7](https://github.com/IQSS/dataverse-frontend/commit/b2c31a7c230c07522d8fce539fa28fafaf26dc95))
- **Form Inputs:** allow buttons inside form inputs ([0000a4a](https://github.com/IQSS/dataverse-frontend/commit/0000a4a8fd75d63d8b49e0963698d387e081f5de))

### Features

- **Breadcrumb:** add linkAs prop ([f9c5f8a](https://github.com/IQSS/dataverse-frontend/commit/f9c5f8a896b2fb67c025cb90b6f971b529e2a3ef))
- **Pagination:** add Pagination component to the design system ([0274ca4](https://github.com/IQSS/dataverse-frontend/commit/0274ca4581eb6d3d4e11880af1a6eee390e1a7b8))
- **OverlayTrigger:** add OverlayTrigger to the Design System ([203c1ec](https://github.com/IQSS/dataverse-frontend/commit/203c1ecbf195379363559ab4e5c3d93f3710aa82))
- **DropdownHeader:** add DropdownHeader to the Design System ([1ed14be](https://github.com/IQSS/dataverse-frontend/commit/1ed14bebb021363e6490812eb05c834926ffb2d9))
- **DropdownSeparator:** add DropdownSeparator to the design system ([b4ce154](https://github.com/IQSS/dataverse-frontend/commit/b4ce154a9df880b6b5dfa993bf86c12ffbc926d2))

# [1.0.1](https://github.com/IQSS/dataverse-frontend/compare/@iqss/dataverse-design-system@1.0.0...@iqss/dataverse-design-system@1.0.1) (2023-07-06)

### Fixes

- Removed unused font files causing the import of some components to fail

# 1.0.0 (2023-07-05)

### Features

- Created first version of the design system
