# Documentation de document

## getAction :

### sans paramètres

#### endpoint :

```http
GET /document/v1/document-cell/:document_id
```

#### entité :

document_cell

#### paramètres :

`document_id` : l'id du document auquel appartient la cellule

#### retourne :

La liste des cellules de document

### avec paramètre

#### endpoint :

```http
GET /document/v1/document-cell/:document_id/:identifier
```

#### entité :

document_cell

#### paramètres :

`document_id` : l'id du document auquel appartient la cellule

`identifier` : l'identifier de la cellule à récupérer

#### retourne :

La cellule de document avec l'identifier `:identifier`

### paramètres de query :

`columns` [array] : les colonnes à récupérer. [`"id"`, `"identifier"`, `"document_id"`, `"content"`, `"row"`, `"column"`] par défaut

## postAction :

#### endpoint :

```http
PUT /document/v1/document-cell/:document_id
```

### entité :

document_cell

#### paramètres :

`document_id` : l'id du document auquel appartient la cellule

### corps de la requête :

```json
{
    "identifier": "",
    "document_id": 0,
    "content": "",
    "row": 0,
    "column": 0,
}
```

## patchAction :

#### endpoint :

```http
PATCH /document/v1/document-cell/:id/:action
```

### entité :

document_cell

#### paramètres :

`id` : l'id de la cellule à modifier

`action` : l'action à réaliser : annuler une modification ou la rétablir

### corps de la requête :

```json
{
    "identifier": "",
    "document_id": 0,
    "content": "",
    "row": 0,
    "column": 0,
}
```
