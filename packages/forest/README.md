# `@atrilabs/forest`

Let's go through the concepts bottoms-up. The lowest level data structures are `tree` and `forest`. A tree doesn't exist standalone i.e. it exists only inside a forest, hence, the `createTree` function in `tees.ts` takes `forest` as one of the argument. Every `forest` has a root tree and all other `tree`s can be considered a child tree. This relationship between a root tree and child tree is same as foreign key relationship in a relational database.

## `createForest` function

The `createForest` function takes forest definition to create a set of trees (first tree in the definition is treated as the root tree). A tree from a forest can be extracted using its id (an id is of the format <package_name>/<path_to_module>).
