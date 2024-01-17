# Guidelines

## Introduction

This guide has the objective of establishing development directives to synchronize all members of a project to work in the same way, with the same concepts and nomenclatures.

## Good practices

### Code

#### Nomenclatures

✅ Index file

The index file is intended to facilitate the `import` of files outside of your root folder. From there we export the modules so that they can bi used in the corresponding part of the application.

✅ Function name

The fuctions must be named in `camelCase` form. Ej:

- **myFunction**
- **createNewUser**

✅ Variable name

The variables must be named in `camenCase`. Ej:

- **myVariable**
- **userActiveCart**

✅ Boolean variables name

The variables that have _boolean_ values must be named in `camelCase` and must be descriptive. Ej:

- **isVisible**
- **isActive**
- **isAdmin**

✅ Constants variables name

The _constants_ variables must be named in `UPPERCASE`. Ej:

- **HASH_SALT**
- **EMAIL_REGEX**

✅ Files and folders names

The files and folders must be named in `kebab-case`. Ej:

- **personal-information.ts**
- **customer-data.ts**
- **user-role.interface.ts**

---

### Variables

Always try to name variables with `const` instead of `let`.

### Boolean

Avoid redundant validations of `boolean` values.

```jsx
// Bad
if (array.length > 0) { ... }
if (array.length === 0) { ... }
if (text === "") { ... }

// Good
if (array.length) { ... }
if (!array.length) { ... }
if (!text.length) { ... }

// Bad
if (user === null) { ... }

// Good
if (!user) { ... }
```

### Tempate literals

```jsx
// Bad
const welcome = 'Welcome' + user.name + ' ' + user.surname + '!'

// Good
const welcome = `Welcome ${user.name ${user.surnam!`
```

### Functions

Always try to return quickly to avoid unnecessary code executions.

```jsx
// Bad
const formatUser = (user) => {
  const fullName = user ? getFullName(user) : ''
  const age = user ? getAge(user.birthDate) : ''
  const formattedUser = user ? `${fullName}, age: ${age}` : ''

  return formattedUser

}

// Good
const formatUser = (user) => {
  if (!user) return ''
  ...
}
```

### Loops

Always try to use `map` `filter` o `reduce` instead of `for` o `forEach`.

```jsx
// Bad
const admins = [];

users.forEach((user) => {
  if (user.type === 'ADMIN') admins.push(user);
});

// Good
const admins = users.filter((user) => user.type === 'ADMIN');
```

Avoid the `swicht` sentence

```jsx
// Bad
const getCountryNumberCode = (country) => {
  switch(country) {
    case 'AR':
      return '54'

    case 'CL':
      return '56'

    case 'CO':
      return '57'
  }
}

// Good
const CountriesNumberCodes = {
  AR = '54',
  CL = '56',
  CO = '57',
}

const getCountryNumberCode = (country) => CountriesNumberCodes[country]
```

---

## Git

### Branches

The branches must be named in `kebab-case`.

We will work with 4 kind of branches:

1. **Feature** branch → new functionalities or improved code.
   Format: `feature/{ticket-number}-{short-imperative-description}`.
   Ej: `feature/FT-1234-create-user-model`
2. **Bugfix** branch → errors that merged into dev environment.
   Format: `bugfix/{ticket-number}-{short-imperative-description}`.
   Ej: `bugfix/FT-1234-fix-typo`
3. **Release** branch → new functionalities or improved code implemented into production.
   Format: `release/{version}` o `release/{ticket-number}-{short-imperative-description}`
   Ej: `release/3.6.1` o `release/FT-1234-create-authorization-service`
4. **Hotfix** branch → errors that merged into production.
   Format: `hotfix/{ticket-number}-{short-imperative-description}`
   Ej: `hotfix/FT-1234-remove-invalid-data`

---

## Rest API

✅ Endpoints

Always we try to create a endpoint name with `noun` in plural.

### Methods

✅ **GET**

To retrieve resources or data.

Ej: `/users`

✅ **POST:**

To create a new data.

Ej: `/products`

✅ **PUT:**

To update an entire record.

Ej: `/books/:id`

✅ **PATCH:**

To update a part of the record.

Ej: `/cars/:id`

✅ **DELETE:**

To delete one or more records.

Ej: `/employees/:id`

### Query params

The query params must be used with `camelCase`.

Ej: `/users/?isActive=false`

### Versining

Ej: `/api/v1/users/`
