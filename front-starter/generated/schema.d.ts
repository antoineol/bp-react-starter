export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  uuid: any,
};

/** columns and relationships of "author" */
export type Author = {
  __typename?: 'author',
  id: Scalars['uuid'],
  name: Scalars['String'],
};

/** aggregated selection of "author" */
export type Author_Aggregate = {
  __typename?: 'author_aggregate',
  aggregate?: Maybe<Author_Aggregate_Fields>,
  nodes: Array<Author>,
};

/** aggregate fields of "author" */
export type Author_Aggregate_Fields = {
  __typename?: 'author_aggregate_fields',
  count?: Maybe<Scalars['Int']>,
  max?: Maybe<Author_Max_Fields>,
  min?: Maybe<Author_Min_Fields>,
};


/** aggregate fields of "author" */
export type Author_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Author_Select_Column>>,
  distinct?: Maybe<Scalars['Boolean']>
};

/** order by aggregate values of table "author" */
export type Author_Aggregate_Order_By = {
  count?: Maybe<Order_By>,
  max?: Maybe<Author_Max_Order_By>,
  min?: Maybe<Author_Min_Order_By>,
};

/** input type for inserting array relation for remote table "author" */
export type Author_Arr_Rel_Insert_Input = {
  data: Array<Author_Insert_Input>,
  on_conflict?: Maybe<Author_On_Conflict>,
};

/** Boolean expression to filter rows from the table "author". All fields are combined with a logical 'AND'. */
export type Author_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Author_Bool_Exp>>>,
  _not?: Maybe<Author_Bool_Exp>,
  _or?: Maybe<Array<Maybe<Author_Bool_Exp>>>,
  id?: Maybe<Uuid_Comparison_Exp>,
  name?: Maybe<String_Comparison_Exp>,
};

/** unique or primary key constraints on table "author" */
export enum Author_Constraint {
  /** unique or primary key constraint */
  AuthorPkey = 'author_pkey'
}

/** input type for inserting data into table "author" */
export type Author_Insert_Input = {
  id?: Maybe<Scalars['uuid']>,
  name?: Maybe<Scalars['String']>,
};

/** aggregate max on columns */
export type Author_Max_Fields = {
  __typename?: 'author_max_fields',
  name?: Maybe<Scalars['String']>,
};

/** order by max() on columns of table "author" */
export type Author_Max_Order_By = {
  name?: Maybe<Order_By>,
};

/** aggregate min on columns */
export type Author_Min_Fields = {
  __typename?: 'author_min_fields',
  name?: Maybe<Scalars['String']>,
};

/** order by min() on columns of table "author" */
export type Author_Min_Order_By = {
  name?: Maybe<Order_By>,
};

/** response of any mutation on the table "author" */
export type Author_Mutation_Response = {
  __typename?: 'author_mutation_response',
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'],
  /** data of the affected rows by the mutation */
  returning: Array<Author>,
};

/** input type for inserting object relation for remote table "author" */
export type Author_Obj_Rel_Insert_Input = {
  data: Author_Insert_Input,
  on_conflict?: Maybe<Author_On_Conflict>,
};

/** on conflict condition type for table "author" */
export type Author_On_Conflict = {
  constraint: Author_Constraint,
  update_columns: Array<Author_Update_Column>,
  where?: Maybe<Author_Bool_Exp>,
};

/** ordering options when selecting data from "author" */
export type Author_Order_By = {
  id?: Maybe<Order_By>,
  name?: Maybe<Order_By>,
};

/** select columns of table "author" */
export enum Author_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "author" */
export type Author_Set_Input = {
  id?: Maybe<Scalars['uuid']>,
  name?: Maybe<Scalars['String']>,
};

/** update columns of table "author" */
export enum Author_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Features = {
  __typename?: 'Features',
  queryJsonPlaceholder: Scalars['Boolean'],
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root',
  /** delete data from the table: "author" */
  delete_author?: Maybe<Author_Mutation_Response>,
  /** insert data into the table: "author" */
  insert_author?: Maybe<Author_Mutation_Response>,
  /** update data of the table: "author" */
  update_author?: Maybe<Author_Mutation_Response>,
};


/** mutation root */
export type Mutation_RootDelete_AuthorArgs = {
  where: Author_Bool_Exp
};


/** mutation root */
export type Mutation_RootInsert_AuthorArgs = {
  objects: Array<Author_Insert_Input>,
  on_conflict?: Maybe<Author_On_Conflict>
};


/** mutation root */
export type Mutation_RootUpdate_AuthorArgs = {
  _set?: Maybe<Author_Set_Input>,
  where: Author_Bool_Exp
};

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query = {
  __typename?: 'Query',
  features: Features,
};

/** query root */
export type Query_Root = {
  __typename?: 'query_root',
  /** fetch data from the table: "author" */
  author: Array<Author>,
  /** fetch aggregated fields from the table: "author" */
  author_aggregate: Author_Aggregate,
  /** fetch data from the table: "author" using primary key columns */
  author_by_pk?: Maybe<Author>,
  features: Features,
};


/** query root */
export type Query_RootAuthorArgs = {
  distinct_on?: Maybe<Array<Author_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Author_Order_By>>,
  where?: Maybe<Author_Bool_Exp>
};


/** query root */
export type Query_RootAuthor_AggregateArgs = {
  distinct_on?: Maybe<Array<Author_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Author_Order_By>>,
  where?: Maybe<Author_Bool_Exp>
};


/** query root */
export type Query_RootAuthor_By_PkArgs = {
  id: Scalars['uuid']
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>,
  _gt?: Maybe<Scalars['String']>,
  _gte?: Maybe<Scalars['String']>,
  _ilike?: Maybe<Scalars['String']>,
  _in?: Maybe<Array<Scalars['String']>>,
  _is_null?: Maybe<Scalars['Boolean']>,
  _like?: Maybe<Scalars['String']>,
  _lt?: Maybe<Scalars['String']>,
  _lte?: Maybe<Scalars['String']>,
  _neq?: Maybe<Scalars['String']>,
  _nilike?: Maybe<Scalars['String']>,
  _nin?: Maybe<Array<Scalars['String']>>,
  _nlike?: Maybe<Scalars['String']>,
  _nsimilar?: Maybe<Scalars['String']>,
  _similar?: Maybe<Scalars['String']>,
};

/** subscription root */
export type Subscription_Root = {
  __typename?: 'subscription_root',
  /** fetch data from the table: "author" */
  author: Array<Author>,
  /** fetch aggregated fields from the table: "author" */
  author_aggregate: Author_Aggregate,
  /** fetch data from the table: "author" using primary key columns */
  author_by_pk?: Maybe<Author>,
};


/** subscription root */
export type Subscription_RootAuthorArgs = {
  distinct_on?: Maybe<Array<Author_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Author_Order_By>>,
  where?: Maybe<Author_Bool_Exp>
};


/** subscription root */
export type Subscription_RootAuthor_AggregateArgs = {
  distinct_on?: Maybe<Array<Author_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Author_Order_By>>,
  where?: Maybe<Author_Bool_Exp>
};


/** subscription root */
export type Subscription_RootAuthor_By_PkArgs = {
  id: Scalars['uuid']
};


/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: Maybe<Scalars['uuid']>,
  _gt?: Maybe<Scalars['uuid']>,
  _gte?: Maybe<Scalars['uuid']>,
  _in?: Maybe<Array<Scalars['uuid']>>,
  _is_null?: Maybe<Scalars['Boolean']>,
  _lt?: Maybe<Scalars['uuid']>,
  _lte?: Maybe<Scalars['uuid']>,
  _neq?: Maybe<Scalars['uuid']>,
  _nin?: Maybe<Array<Scalars['uuid']>>,
};
