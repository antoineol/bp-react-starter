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

/** columns and relationships of "article" */
export type Article = {
  __typename?: 'article',
  /** An array relationship */
  article_tags: Array<Article_Tag>,
  /** An aggregated array relationship */
  article_tags_aggregate: Article_Tag_Aggregate,
  /** An object relationship */
  author: Author,
  author_id: Scalars['uuid'],
  content: Scalars['String'],
  id: Scalars['uuid'],
  rating: Scalars['Int'],
  /** An array relationship */
  tags: Array<Article_Tags_View>,
  /** An aggregated array relationship */
  tags_aggregate: Article_Tags_View_Aggregate,
  title: Scalars['String'],
};


/** columns and relationships of "article" */
export type ArticleArticle_TagsArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};


/** columns and relationships of "article" */
export type ArticleArticle_Tags_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};


/** columns and relationships of "article" */
export type ArticleTagsArgs = {
  distinct_on?: Maybe<Array<Article_Tags_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tags_View_Order_By>>,
  where?: Maybe<Article_Tags_View_Bool_Exp>
};


/** columns and relationships of "article" */
export type ArticleTags_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tags_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tags_View_Order_By>>,
  where?: Maybe<Article_Tags_View_Bool_Exp>
};

/** aggregated selection of "article" */
export type Article_Aggregate = {
  __typename?: 'article_aggregate',
  aggregate?: Maybe<Article_Aggregate_Fields>,
  nodes: Array<Article>,
};

/** aggregate fields of "article" */
export type Article_Aggregate_Fields = {
  __typename?: 'article_aggregate_fields',
  avg?: Maybe<Article_Avg_Fields>,
  count?: Maybe<Scalars['Int']>,
  max?: Maybe<Article_Max_Fields>,
  min?: Maybe<Article_Min_Fields>,
  stddev?: Maybe<Article_Stddev_Fields>,
  stddev_pop?: Maybe<Article_Stddev_Pop_Fields>,
  stddev_samp?: Maybe<Article_Stddev_Samp_Fields>,
  sum?: Maybe<Article_Sum_Fields>,
  var_pop?: Maybe<Article_Var_Pop_Fields>,
  var_samp?: Maybe<Article_Var_Samp_Fields>,
  variance?: Maybe<Article_Variance_Fields>,
};


/** aggregate fields of "article" */
export type Article_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Article_Select_Column>>,
  distinct?: Maybe<Scalars['Boolean']>
};

/** order by aggregate values of table "article" */
export type Article_Aggregate_Order_By = {
  avg?: Maybe<Article_Avg_Order_By>,
  count?: Maybe<Order_By>,
  max?: Maybe<Article_Max_Order_By>,
  min?: Maybe<Article_Min_Order_By>,
  stddev?: Maybe<Article_Stddev_Order_By>,
  stddev_pop?: Maybe<Article_Stddev_Pop_Order_By>,
  stddev_samp?: Maybe<Article_Stddev_Samp_Order_By>,
  sum?: Maybe<Article_Sum_Order_By>,
  var_pop?: Maybe<Article_Var_Pop_Order_By>,
  var_samp?: Maybe<Article_Var_Samp_Order_By>,
  variance?: Maybe<Article_Variance_Order_By>,
};

/** input type for inserting array relation for remote table "article" */
export type Article_Arr_Rel_Insert_Input = {
  data: Array<Article_Insert_Input>,
  on_conflict?: Maybe<Article_On_Conflict>,
};

/** aggregate avg on columns */
export type Article_Avg_Fields = {
  __typename?: 'article_avg_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by avg() on columns of table "article" */
export type Article_Avg_Order_By = {
  rating?: Maybe<Order_By>,
};

/** Boolean expression to filter rows from the table "article". All fields are combined with a logical 'AND'. */
export type Article_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Article_Bool_Exp>>>,
  _not?: Maybe<Article_Bool_Exp>,
  _or?: Maybe<Array<Maybe<Article_Bool_Exp>>>,
  article_tags?: Maybe<Article_Tag_Bool_Exp>,
  author?: Maybe<Author_Bool_Exp>,
  author_id?: Maybe<Uuid_Comparison_Exp>,
  content?: Maybe<String_Comparison_Exp>,
  id?: Maybe<Uuid_Comparison_Exp>,
  rating?: Maybe<Int_Comparison_Exp>,
  tags?: Maybe<Article_Tags_View_Bool_Exp>,
  title?: Maybe<String_Comparison_Exp>,
};

/** unique or primary key constraints on table "article" */
export enum Article_Constraint {
  /** unique or primary key constraint */
  ArticlePkey = 'article_pkey'
}

/** input type for incrementing integer columne in table "article" */
export type Article_Inc_Input = {
  rating?: Maybe<Scalars['Int']>,
};

/** input type for inserting data into table "article" */
export type Article_Insert_Input = {
  article_tags?: Maybe<Article_Tag_Arr_Rel_Insert_Input>,
  author?: Maybe<Author_Obj_Rel_Insert_Input>,
  author_id?: Maybe<Scalars['uuid']>,
  content?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['uuid']>,
  rating?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

/** aggregate max on columns */
export type Article_Max_Fields = {
  __typename?: 'article_max_fields',
  content?: Maybe<Scalars['String']>,
  rating?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

/** order by max() on columns of table "article" */
export type Article_Max_Order_By = {
  content?: Maybe<Order_By>,
  rating?: Maybe<Order_By>,
  title?: Maybe<Order_By>,
};

/** aggregate min on columns */
export type Article_Min_Fields = {
  __typename?: 'article_min_fields',
  content?: Maybe<Scalars['String']>,
  rating?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

/** order by min() on columns of table "article" */
export type Article_Min_Order_By = {
  content?: Maybe<Order_By>,
  rating?: Maybe<Order_By>,
  title?: Maybe<Order_By>,
};

/** response of any mutation on the table "article" */
export type Article_Mutation_Response = {
  __typename?: 'article_mutation_response',
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'],
  /** data of the affected rows by the mutation */
  returning: Array<Article>,
};

/** input type for inserting object relation for remote table "article" */
export type Article_Obj_Rel_Insert_Input = {
  data: Article_Insert_Input,
  on_conflict?: Maybe<Article_On_Conflict>,
};

/** on conflict condition type for table "article" */
export type Article_On_Conflict = {
  constraint: Article_Constraint,
  update_columns: Array<Article_Update_Column>,
  where?: Maybe<Article_Bool_Exp>,
};

/** ordering options when selecting data from "article" */
export type Article_Order_By = {
  article_tags_aggregate?: Maybe<Article_Tag_Aggregate_Order_By>,
  author?: Maybe<Author_Order_By>,
  author_id?: Maybe<Order_By>,
  content?: Maybe<Order_By>,
  id?: Maybe<Order_By>,
  rating?: Maybe<Order_By>,
  tags_aggregate?: Maybe<Article_Tags_View_Aggregate_Order_By>,
  title?: Maybe<Order_By>,
};

/** select columns of table "article" */
export enum Article_Select_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Content = 'content',
  /** column name */
  Id = 'id',
  /** column name */
  Rating = 'rating',
  /** column name */
  Title = 'title'
}

/** input type for updating data in table "article" */
export type Article_Set_Input = {
  author_id?: Maybe<Scalars['uuid']>,
  content?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['uuid']>,
  rating?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

/** aggregate stddev on columns */
export type Article_Stddev_Fields = {
  __typename?: 'article_stddev_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by stddev() on columns of table "article" */
export type Article_Stddev_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate stddev_pop on columns */
export type Article_Stddev_Pop_Fields = {
  __typename?: 'article_stddev_pop_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by stddev_pop() on columns of table "article" */
export type Article_Stddev_Pop_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate stddev_samp on columns */
export type Article_Stddev_Samp_Fields = {
  __typename?: 'article_stddev_samp_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by stddev_samp() on columns of table "article" */
export type Article_Stddev_Samp_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate sum on columns */
export type Article_Sum_Fields = {
  __typename?: 'article_sum_fields',
  rating?: Maybe<Scalars['Int']>,
};

/** order by sum() on columns of table "article" */
export type Article_Sum_Order_By = {
  rating?: Maybe<Order_By>,
};

/** columns and relationships of "article_tag" */
export type Article_Tag = {
  __typename?: 'article_tag',
  /** An object relationship */
  article: Article,
  article_id: Scalars['uuid'],
  /** An object relationship */
  tag: Tag,
  tag_id: Scalars['uuid'],
};

/** aggregated selection of "article_tag" */
export type Article_Tag_Aggregate = {
  __typename?: 'article_tag_aggregate',
  aggregate?: Maybe<Article_Tag_Aggregate_Fields>,
  nodes: Array<Article_Tag>,
};

/** aggregate fields of "article_tag" */
export type Article_Tag_Aggregate_Fields = {
  __typename?: 'article_tag_aggregate_fields',
  count?: Maybe<Scalars['Int']>,
};


/** aggregate fields of "article_tag" */
export type Article_Tag_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Article_Tag_Select_Column>>,
  distinct?: Maybe<Scalars['Boolean']>
};

/** order by aggregate values of table "article_tag" */
export type Article_Tag_Aggregate_Order_By = {
  count?: Maybe<Order_By>,
};

/** input type for inserting array relation for remote table "article_tag" */
export type Article_Tag_Arr_Rel_Insert_Input = {
  data: Array<Article_Tag_Insert_Input>,
  on_conflict?: Maybe<Article_Tag_On_Conflict>,
};

/** Boolean expression to filter rows from the table "article_tag". All fields are combined with a logical 'AND'. */
export type Article_Tag_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Article_Tag_Bool_Exp>>>,
  _not?: Maybe<Article_Tag_Bool_Exp>,
  _or?: Maybe<Array<Maybe<Article_Tag_Bool_Exp>>>,
  article?: Maybe<Article_Bool_Exp>,
  article_id?: Maybe<Uuid_Comparison_Exp>,
  tag?: Maybe<Tag_Bool_Exp>,
  tag_id?: Maybe<Uuid_Comparison_Exp>,
};

/** unique or primary key constraints on table "article_tag" */
export enum Article_Tag_Constraint {
  /** unique or primary key constraint */
  ArticleTagPkey = 'article_tag_pkey'
}

/** input type for inserting data into table "article_tag" */
export type Article_Tag_Insert_Input = {
  article?: Maybe<Article_Obj_Rel_Insert_Input>,
  article_id?: Maybe<Scalars['uuid']>,
  tag?: Maybe<Tag_Obj_Rel_Insert_Input>,
  tag_id?: Maybe<Scalars['uuid']>,
};

/** response of any mutation on the table "article_tag" */
export type Article_Tag_Mutation_Response = {
  __typename?: 'article_tag_mutation_response',
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'],
  /** data of the affected rows by the mutation */
  returning: Array<Article_Tag>,
};

/** input type for inserting object relation for remote table "article_tag" */
export type Article_Tag_Obj_Rel_Insert_Input = {
  data: Article_Tag_Insert_Input,
  on_conflict?: Maybe<Article_Tag_On_Conflict>,
};

/** on conflict condition type for table "article_tag" */
export type Article_Tag_On_Conflict = {
  constraint: Article_Tag_Constraint,
  update_columns: Array<Article_Tag_Update_Column>,
  where?: Maybe<Article_Tag_Bool_Exp>,
};

/** ordering options when selecting data from "article_tag" */
export type Article_Tag_Order_By = {
  article?: Maybe<Article_Order_By>,
  article_id?: Maybe<Order_By>,
  tag?: Maybe<Tag_Order_By>,
  tag_id?: Maybe<Order_By>,
};

/** select columns of table "article_tag" */
export enum Article_Tag_Select_Column {
  /** column name */
  ArticleId = 'article_id',
  /** column name */
  TagId = 'tag_id'
}

/** input type for updating data in table "article_tag" */
export type Article_Tag_Set_Input = {
  article_id?: Maybe<Scalars['uuid']>,
  tag_id?: Maybe<Scalars['uuid']>,
};

/** update columns of table "article_tag" */
export enum Article_Tag_Update_Column {
  /** column name */
  ArticleId = 'article_id',
  /** column name */
  TagId = 'tag_id'
}

/** columns and relationships of "article_tags_view" */
export type Article_Tags_View = {
  __typename?: 'article_tags_view',
  article_id?: Maybe<Scalars['uuid']>,
  id?: Maybe<Scalars['uuid']>,
  tag_value?: Maybe<Scalars['String']>,
};

/** aggregated selection of "article_tags_view" */
export type Article_Tags_View_Aggregate = {
  __typename?: 'article_tags_view_aggregate',
  aggregate?: Maybe<Article_Tags_View_Aggregate_Fields>,
  nodes: Array<Article_Tags_View>,
};

/** aggregate fields of "article_tags_view" */
export type Article_Tags_View_Aggregate_Fields = {
  __typename?: 'article_tags_view_aggregate_fields',
  count?: Maybe<Scalars['Int']>,
  max?: Maybe<Article_Tags_View_Max_Fields>,
  min?: Maybe<Article_Tags_View_Min_Fields>,
};


/** aggregate fields of "article_tags_view" */
export type Article_Tags_View_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Article_Tags_View_Select_Column>>,
  distinct?: Maybe<Scalars['Boolean']>
};

/** order by aggregate values of table "article_tags_view" */
export type Article_Tags_View_Aggregate_Order_By = {
  count?: Maybe<Order_By>,
  max?: Maybe<Article_Tags_View_Max_Order_By>,
  min?: Maybe<Article_Tags_View_Min_Order_By>,
};

/** Boolean expression to filter rows from the table "article_tags_view". All fields are combined with a logical 'AND'. */
export type Article_Tags_View_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Article_Tags_View_Bool_Exp>>>,
  _not?: Maybe<Article_Tags_View_Bool_Exp>,
  _or?: Maybe<Array<Maybe<Article_Tags_View_Bool_Exp>>>,
  article_id?: Maybe<Uuid_Comparison_Exp>,
  id?: Maybe<Uuid_Comparison_Exp>,
  tag_value?: Maybe<String_Comparison_Exp>,
};

/** aggregate max on columns */
export type Article_Tags_View_Max_Fields = {
  __typename?: 'article_tags_view_max_fields',
  tag_value?: Maybe<Scalars['String']>,
};

/** order by max() on columns of table "article_tags_view" */
export type Article_Tags_View_Max_Order_By = {
  tag_value?: Maybe<Order_By>,
};

/** aggregate min on columns */
export type Article_Tags_View_Min_Fields = {
  __typename?: 'article_tags_view_min_fields',
  tag_value?: Maybe<Scalars['String']>,
};

/** order by min() on columns of table "article_tags_view" */
export type Article_Tags_View_Min_Order_By = {
  tag_value?: Maybe<Order_By>,
};

/** ordering options when selecting data from "article_tags_view" */
export type Article_Tags_View_Order_By = {
  article_id?: Maybe<Order_By>,
  id?: Maybe<Order_By>,
  tag_value?: Maybe<Order_By>,
};

/** select columns of table "article_tags_view" */
export enum Article_Tags_View_Select_Column {
  /** column name */
  ArticleId = 'article_id',
  /** column name */
  Id = 'id',
  /** column name */
  TagValue = 'tag_value'
}

/** update columns of table "article" */
export enum Article_Update_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Content = 'content',
  /** column name */
  Id = 'id',
  /** column name */
  Rating = 'rating',
  /** column name */
  Title = 'title'
}

/** aggregate var_pop on columns */
export type Article_Var_Pop_Fields = {
  __typename?: 'article_var_pop_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by var_pop() on columns of table "article" */
export type Article_Var_Pop_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate var_samp on columns */
export type Article_Var_Samp_Fields = {
  __typename?: 'article_var_samp_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by var_samp() on columns of table "article" */
export type Article_Var_Samp_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate variance on columns */
export type Article_Variance_Fields = {
  __typename?: 'article_variance_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by variance() on columns of table "article" */
export type Article_Variance_Order_By = {
  rating?: Maybe<Order_By>,
};

/** columns and relationships of "author" */
export type Author = {
  __typename?: 'author',
  /** An array relationship */
  articles: Array<Article>,
  /** An aggregated array relationship */
  articles_aggregate: Article_Aggregate,
  id: Scalars['uuid'],
  name: Scalars['String'],
};


/** columns and relationships of "author" */
export type AuthorArticlesArgs = {
  distinct_on?: Maybe<Array<Article_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Order_By>>,
  where?: Maybe<Article_Bool_Exp>
};


/** columns and relationships of "author" */
export type AuthorArticles_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Order_By>>,
  where?: Maybe<Article_Bool_Exp>
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
  articles?: Maybe<Article_Bool_Exp>,
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
  articles?: Maybe<Article_Arr_Rel_Insert_Input>,
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
  articles_aggregate?: Maybe<Article_Aggregate_Order_By>,
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

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>,
  _gt?: Maybe<Scalars['Int']>,
  _gte?: Maybe<Scalars['Int']>,
  _in?: Maybe<Array<Scalars['Int']>>,
  _is_null?: Maybe<Scalars['Boolean']>,
  _lt?: Maybe<Scalars['Int']>,
  _lte?: Maybe<Scalars['Int']>,
  _neq?: Maybe<Scalars['Int']>,
  _nin?: Maybe<Array<Scalars['Int']>>,
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root',
  /** delete data from the table: "article" */
  delete_article?: Maybe<Article_Mutation_Response>,
  /** delete data from the table: "article_tag" */
  delete_article_tag?: Maybe<Article_Tag_Mutation_Response>,
  /** delete data from the table: "author" */
  delete_author?: Maybe<Author_Mutation_Response>,
  /** delete data from the table: "tag" */
  delete_tag?: Maybe<Tag_Mutation_Response>,
  /** insert data into the table: "article" */
  insert_article?: Maybe<Article_Mutation_Response>,
  /** insert data into the table: "article_tag" */
  insert_article_tag?: Maybe<Article_Tag_Mutation_Response>,
  /** insert data into the table: "author" */
  insert_author?: Maybe<Author_Mutation_Response>,
  /** insert data into the table: "tag" */
  insert_tag?: Maybe<Tag_Mutation_Response>,
  /** update data of the table: "article" */
  update_article?: Maybe<Article_Mutation_Response>,
  /** update data of the table: "article_tag" */
  update_article_tag?: Maybe<Article_Tag_Mutation_Response>,
  /** update data of the table: "author" */
  update_author?: Maybe<Author_Mutation_Response>,
  /** update data of the table: "tag" */
  update_tag?: Maybe<Tag_Mutation_Response>,
};


/** mutation root */
export type Mutation_RootDelete_ArticleArgs = {
  where: Article_Bool_Exp
};


/** mutation root */
export type Mutation_RootDelete_Article_TagArgs = {
  where: Article_Tag_Bool_Exp
};


/** mutation root */
export type Mutation_RootDelete_AuthorArgs = {
  where: Author_Bool_Exp
};


/** mutation root */
export type Mutation_RootDelete_TagArgs = {
  where: Tag_Bool_Exp
};


/** mutation root */
export type Mutation_RootInsert_ArticleArgs = {
  objects: Array<Article_Insert_Input>,
  on_conflict?: Maybe<Article_On_Conflict>
};


/** mutation root */
export type Mutation_RootInsert_Article_TagArgs = {
  objects: Array<Article_Tag_Insert_Input>,
  on_conflict?: Maybe<Article_Tag_On_Conflict>
};


/** mutation root */
export type Mutation_RootInsert_AuthorArgs = {
  objects: Array<Author_Insert_Input>,
  on_conflict?: Maybe<Author_On_Conflict>
};


/** mutation root */
export type Mutation_RootInsert_TagArgs = {
  objects: Array<Tag_Insert_Input>,
  on_conflict?: Maybe<Tag_On_Conflict>
};


/** mutation root */
export type Mutation_RootUpdate_ArticleArgs = {
  _inc?: Maybe<Article_Inc_Input>,
  _set?: Maybe<Article_Set_Input>,
  where: Article_Bool_Exp
};


/** mutation root */
export type Mutation_RootUpdate_Article_TagArgs = {
  _set?: Maybe<Article_Tag_Set_Input>,
  where: Article_Tag_Bool_Exp
};


/** mutation root */
export type Mutation_RootUpdate_AuthorArgs = {
  _set?: Maybe<Author_Set_Input>,
  where: Author_Bool_Exp
};


/** mutation root */
export type Mutation_RootUpdate_TagArgs = {
  _set?: Maybe<Tag_Set_Input>,
  where: Tag_Bool_Exp
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
  /** fetch data from the table: "article" */
  article: Array<Article>,
  /** fetch aggregated fields from the table: "article" */
  article_aggregate: Article_Aggregate,
  /** fetch data from the table: "article" using primary key columns */
  article_by_pk?: Maybe<Article>,
  /** fetch data from the table: "article_tag" */
  article_tag: Array<Article_Tag>,
  /** fetch aggregated fields from the table: "article_tag" */
  article_tag_aggregate: Article_Tag_Aggregate,
  /** fetch data from the table: "article_tag" using primary key columns */
  article_tag_by_pk?: Maybe<Article_Tag>,
  /** fetch data from the table: "article_tags_view" */
  article_tags_view: Array<Article_Tags_View>,
  /** fetch aggregated fields from the table: "article_tags_view" */
  article_tags_view_aggregate: Article_Tags_View_Aggregate,
  /** fetch data from the table: "author" */
  author: Array<Author>,
  /** fetch aggregated fields from the table: "author" */
  author_aggregate: Author_Aggregate,
  /** fetch data from the table: "author" using primary key columns */
  author_by_pk?: Maybe<Author>,
  features: Features,
  /** fetch data from the table: "tag" */
  tag: Array<Tag>,
  /** fetch aggregated fields from the table: "tag" */
  tag_aggregate: Tag_Aggregate,
  /** fetch data from the table: "tag_articles_view" */
  tag_articles_view: Array<Tag_Articles_View>,
  /** fetch aggregated fields from the table: "tag_articles_view" */
  tag_articles_view_aggregate: Tag_Articles_View_Aggregate,
  /** fetch data from the table: "tag" using primary key columns */
  tag_by_pk?: Maybe<Tag>,
};

/** query root */
export type Query_RootArticleArgs = {
  distinct_on?: Maybe<Array<Article_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Order_By>>,
  where?: Maybe<Article_Bool_Exp>
};

/** query root */
export type Query_RootArticle_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Order_By>>,
  where?: Maybe<Article_Bool_Exp>
};

/** query root */
export type Query_RootArticle_By_PkArgs = {
  id: Scalars['uuid']
};

/** query root */
export type Query_RootArticle_TagArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};

/** query root */
export type Query_RootArticle_Tag_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};

/** query root */
export type Query_RootArticle_Tag_By_PkArgs = {
  article_id: Scalars['uuid'],
  tag_id: Scalars['uuid']
};

/** query root */
export type Query_RootArticle_Tags_ViewArgs = {
  distinct_on?: Maybe<Array<Article_Tags_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tags_View_Order_By>>,
  where?: Maybe<Article_Tags_View_Bool_Exp>
};

/** query root */
export type Query_RootArticle_Tags_View_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tags_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tags_View_Order_By>>,
  where?: Maybe<Article_Tags_View_Bool_Exp>
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

/** query root */
export type Query_RootTagArgs = {
  distinct_on?: Maybe<Array<Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Order_By>>,
  where?: Maybe<Tag_Bool_Exp>
};

/** query root */
export type Query_RootTag_AggregateArgs = {
  distinct_on?: Maybe<Array<Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Order_By>>,
  where?: Maybe<Tag_Bool_Exp>
};

/** query root */
export type Query_RootTag_Articles_ViewArgs = {
  distinct_on?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Articles_View_Order_By>>,
  where?: Maybe<Tag_Articles_View_Bool_Exp>
};

/** query root */
export type Query_RootTag_Articles_View_AggregateArgs = {
  distinct_on?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Articles_View_Order_By>>,
  where?: Maybe<Tag_Articles_View_Bool_Exp>
};

/** query root */
export type Query_RootTag_By_PkArgs = {
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
  /** fetch data from the table: "article" */
  article: Array<Article>,
  /** fetch aggregated fields from the table: "article" */
  article_aggregate: Article_Aggregate,
  /** fetch data from the table: "article" using primary key columns */
  article_by_pk?: Maybe<Article>,
  /** fetch data from the table: "article_tag" */
  article_tag: Array<Article_Tag>,
  /** fetch aggregated fields from the table: "article_tag" */
  article_tag_aggregate: Article_Tag_Aggregate,
  /** fetch data from the table: "article_tag" using primary key columns */
  article_tag_by_pk?: Maybe<Article_Tag>,
  /** fetch data from the table: "article_tags_view" */
  article_tags_view: Array<Article_Tags_View>,
  /** fetch aggregated fields from the table: "article_tags_view" */
  article_tags_view_aggregate: Article_Tags_View_Aggregate,
  /** fetch data from the table: "author" */
  author: Array<Author>,
  /** fetch aggregated fields from the table: "author" */
  author_aggregate: Author_Aggregate,
  /** fetch data from the table: "author" using primary key columns */
  author_by_pk?: Maybe<Author>,
  /** fetch data from the table: "tag" */
  tag: Array<Tag>,
  /** fetch aggregated fields from the table: "tag" */
  tag_aggregate: Tag_Aggregate,
  /** fetch data from the table: "tag_articles_view" */
  tag_articles_view: Array<Tag_Articles_View>,
  /** fetch aggregated fields from the table: "tag_articles_view" */
  tag_articles_view_aggregate: Tag_Articles_View_Aggregate,
  /** fetch data from the table: "tag" using primary key columns */
  tag_by_pk?: Maybe<Tag>,
};

/** subscription root */
export type Subscription_RootArticleArgs = {
  distinct_on?: Maybe<Array<Article_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Order_By>>,
  where?: Maybe<Article_Bool_Exp>
};

/** subscription root */
export type Subscription_RootArticle_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Order_By>>,
  where?: Maybe<Article_Bool_Exp>
};

/** subscription root */
export type Subscription_RootArticle_By_PkArgs = {
  id: Scalars['uuid']
};

/** subscription root */
export type Subscription_RootArticle_TagArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};

/** subscription root */
export type Subscription_RootArticle_Tag_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};

/** subscription root */
export type Subscription_RootArticle_Tag_By_PkArgs = {
  article_id: Scalars['uuid'],
  tag_id: Scalars['uuid']
};

/** subscription root */
export type Subscription_RootArticle_Tags_ViewArgs = {
  distinct_on?: Maybe<Array<Article_Tags_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tags_View_Order_By>>,
  where?: Maybe<Article_Tags_View_Bool_Exp>
};

/** subscription root */
export type Subscription_RootArticle_Tags_View_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tags_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tags_View_Order_By>>,
  where?: Maybe<Article_Tags_View_Bool_Exp>
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

/** subscription root */
export type Subscription_RootTagArgs = {
  distinct_on?: Maybe<Array<Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Order_By>>,
  where?: Maybe<Tag_Bool_Exp>
};

/** subscription root */
export type Subscription_RootTag_AggregateArgs = {
  distinct_on?: Maybe<Array<Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Order_By>>,
  where?: Maybe<Tag_Bool_Exp>
};

/** subscription root */
export type Subscription_RootTag_Articles_ViewArgs = {
  distinct_on?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Articles_View_Order_By>>,
  where?: Maybe<Tag_Articles_View_Bool_Exp>
};

/** subscription root */
export type Subscription_RootTag_Articles_View_AggregateArgs = {
  distinct_on?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Articles_View_Order_By>>,
  where?: Maybe<Tag_Articles_View_Bool_Exp>
};

/** subscription root */
export type Subscription_RootTag_By_PkArgs = {
  id: Scalars['uuid']
};

/** columns and relationships of "tag" */
export type Tag = {
  __typename?: 'tag',
  /** An array relationship */
  articles: Array<Tag_Articles_View>,
  /** An aggregated array relationship */
  articles_aggregate: Tag_Articles_View_Aggregate,
  id: Scalars['uuid'],
  /** An array relationship */
  tag_articles: Array<Article_Tag>,
  /** An aggregated array relationship */
  tag_articles_aggregate: Article_Tag_Aggregate,
  tag_value: Scalars['String'],
};

/** columns and relationships of "tag" */
export type TagArticlesArgs = {
  distinct_on?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Articles_View_Order_By>>,
  where?: Maybe<Tag_Articles_View_Bool_Exp>
};

/** columns and relationships of "tag" */
export type TagArticles_AggregateArgs = {
  distinct_on?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Tag_Articles_View_Order_By>>,
  where?: Maybe<Tag_Articles_View_Bool_Exp>
};

/** columns and relationships of "tag" */
export type TagTag_ArticlesArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};

/** columns and relationships of "tag" */
export type TagTag_Articles_AggregateArgs = {
  distinct_on?: Maybe<Array<Article_Tag_Select_Column>>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Array<Article_Tag_Order_By>>,
  where?: Maybe<Article_Tag_Bool_Exp>
};

/** aggregated selection of "tag" */
export type Tag_Aggregate = {
  __typename?: 'tag_aggregate',
  aggregate?: Maybe<Tag_Aggregate_Fields>,
  nodes: Array<Tag>,
};

/** aggregate fields of "tag" */
export type Tag_Aggregate_Fields = {
  __typename?: 'tag_aggregate_fields',
  count?: Maybe<Scalars['Int']>,
  max?: Maybe<Tag_Max_Fields>,
  min?: Maybe<Tag_Min_Fields>,
};

/** aggregate fields of "tag" */
export type Tag_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Tag_Select_Column>>,
  distinct?: Maybe<Scalars['Boolean']>
};

/** order by aggregate values of table "tag" */
export type Tag_Aggregate_Order_By = {
  count?: Maybe<Order_By>,
  max?: Maybe<Tag_Max_Order_By>,
  min?: Maybe<Tag_Min_Order_By>,
};

/** input type for inserting array relation for remote table "tag" */
export type Tag_Arr_Rel_Insert_Input = {
  data: Array<Tag_Insert_Input>,
  on_conflict?: Maybe<Tag_On_Conflict>,
};

/** columns and relationships of "tag_articles_view" */
export type Tag_Articles_View = {
  __typename?: 'tag_articles_view',
  author_id?: Maybe<Scalars['uuid']>,
  content?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['uuid']>,
  rating?: Maybe<Scalars['Int']>,
  tag_id?: Maybe<Scalars['uuid']>,
  title?: Maybe<Scalars['String']>,
};

/** aggregated selection of "tag_articles_view" */
export type Tag_Articles_View_Aggregate = {
  __typename?: 'tag_articles_view_aggregate',
  aggregate?: Maybe<Tag_Articles_View_Aggregate_Fields>,
  nodes: Array<Tag_Articles_View>,
};

/** aggregate fields of "tag_articles_view" */
export type Tag_Articles_View_Aggregate_Fields = {
  __typename?: 'tag_articles_view_aggregate_fields',
  avg?: Maybe<Tag_Articles_View_Avg_Fields>,
  count?: Maybe<Scalars['Int']>,
  max?: Maybe<Tag_Articles_View_Max_Fields>,
  min?: Maybe<Tag_Articles_View_Min_Fields>,
  stddev?: Maybe<Tag_Articles_View_Stddev_Fields>,
  stddev_pop?: Maybe<Tag_Articles_View_Stddev_Pop_Fields>,
  stddev_samp?: Maybe<Tag_Articles_View_Stddev_Samp_Fields>,
  sum?: Maybe<Tag_Articles_View_Sum_Fields>,
  var_pop?: Maybe<Tag_Articles_View_Var_Pop_Fields>,
  var_samp?: Maybe<Tag_Articles_View_Var_Samp_Fields>,
  variance?: Maybe<Tag_Articles_View_Variance_Fields>,
};

/** aggregate fields of "tag_articles_view" */
export type Tag_Articles_View_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Tag_Articles_View_Select_Column>>,
  distinct?: Maybe<Scalars['Boolean']>
};

/** order by aggregate values of table "tag_articles_view" */
export type Tag_Articles_View_Aggregate_Order_By = {
  avg?: Maybe<Tag_Articles_View_Avg_Order_By>,
  count?: Maybe<Order_By>,
  max?: Maybe<Tag_Articles_View_Max_Order_By>,
  min?: Maybe<Tag_Articles_View_Min_Order_By>,
  stddev?: Maybe<Tag_Articles_View_Stddev_Order_By>,
  stddev_pop?: Maybe<Tag_Articles_View_Stddev_Pop_Order_By>,
  stddev_samp?: Maybe<Tag_Articles_View_Stddev_Samp_Order_By>,
  sum?: Maybe<Tag_Articles_View_Sum_Order_By>,
  var_pop?: Maybe<Tag_Articles_View_Var_Pop_Order_By>,
  var_samp?: Maybe<Tag_Articles_View_Var_Samp_Order_By>,
  variance?: Maybe<Tag_Articles_View_Variance_Order_By>,
};

/** aggregate avg on columns */
export type Tag_Articles_View_Avg_Fields = {
  __typename?: 'tag_articles_view_avg_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by avg() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Avg_Order_By = {
  rating?: Maybe<Order_By>,
};

/** Boolean expression to filter rows from the table "tag_articles_view". All fields are combined with a logical 'AND'. */
export type Tag_Articles_View_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Tag_Articles_View_Bool_Exp>>>,
  _not?: Maybe<Tag_Articles_View_Bool_Exp>,
  _or?: Maybe<Array<Maybe<Tag_Articles_View_Bool_Exp>>>,
  author_id?: Maybe<Uuid_Comparison_Exp>,
  content?: Maybe<String_Comparison_Exp>,
  id?: Maybe<Uuid_Comparison_Exp>,
  rating?: Maybe<Int_Comparison_Exp>,
  tag_id?: Maybe<Uuid_Comparison_Exp>,
  title?: Maybe<String_Comparison_Exp>,
};

/** aggregate max on columns */
export type Tag_Articles_View_Max_Fields = {
  __typename?: 'tag_articles_view_max_fields',
  content?: Maybe<Scalars['String']>,
  rating?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

/** order by max() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Max_Order_By = {
  content?: Maybe<Order_By>,
  rating?: Maybe<Order_By>,
  title?: Maybe<Order_By>,
};

/** aggregate min on columns */
export type Tag_Articles_View_Min_Fields = {
  __typename?: 'tag_articles_view_min_fields',
  content?: Maybe<Scalars['String']>,
  rating?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

/** order by min() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Min_Order_By = {
  content?: Maybe<Order_By>,
  rating?: Maybe<Order_By>,
  title?: Maybe<Order_By>,
};

/** ordering options when selecting data from "tag_articles_view" */
export type Tag_Articles_View_Order_By = {
  author_id?: Maybe<Order_By>,
  content?: Maybe<Order_By>,
  id?: Maybe<Order_By>,
  rating?: Maybe<Order_By>,
  tag_id?: Maybe<Order_By>,
  title?: Maybe<Order_By>,
};

/** select columns of table "tag_articles_view" */
export enum Tag_Articles_View_Select_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Content = 'content',
  /** column name */
  Id = 'id',
  /** column name */
  Rating = 'rating',
  /** column name */
  TagId = 'tag_id',
  /** column name */
  Title = 'title'
}

/** aggregate stddev on columns */
export type Tag_Articles_View_Stddev_Fields = {
  __typename?: 'tag_articles_view_stddev_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by stddev() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Stddev_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate stddev_pop on columns */
export type Tag_Articles_View_Stddev_Pop_Fields = {
  __typename?: 'tag_articles_view_stddev_pop_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by stddev_pop() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Stddev_Pop_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate stddev_samp on columns */
export type Tag_Articles_View_Stddev_Samp_Fields = {
  __typename?: 'tag_articles_view_stddev_samp_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by stddev_samp() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Stddev_Samp_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate sum on columns */
export type Tag_Articles_View_Sum_Fields = {
  __typename?: 'tag_articles_view_sum_fields',
  rating?: Maybe<Scalars['Int']>,
};

/** order by sum() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Sum_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate var_pop on columns */
export type Tag_Articles_View_Var_Pop_Fields = {
  __typename?: 'tag_articles_view_var_pop_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by var_pop() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Var_Pop_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate var_samp on columns */
export type Tag_Articles_View_Var_Samp_Fields = {
  __typename?: 'tag_articles_view_var_samp_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by var_samp() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Var_Samp_Order_By = {
  rating?: Maybe<Order_By>,
};

/** aggregate variance on columns */
export type Tag_Articles_View_Variance_Fields = {
  __typename?: 'tag_articles_view_variance_fields',
  rating?: Maybe<Scalars['Float']>,
};

/** order by variance() on columns of table "tag_articles_view" */
export type Tag_Articles_View_Variance_Order_By = {
  rating?: Maybe<Order_By>,
};

/** Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'. */
export type Tag_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Tag_Bool_Exp>>>,
  _not?: Maybe<Tag_Bool_Exp>,
  _or?: Maybe<Array<Maybe<Tag_Bool_Exp>>>,
  articles?: Maybe<Tag_Articles_View_Bool_Exp>,
  id?: Maybe<Uuid_Comparison_Exp>,
  tag_articles?: Maybe<Article_Tag_Bool_Exp>,
  tag_value?: Maybe<String_Comparison_Exp>,
};

/** unique or primary key constraints on table "tag" */
export enum Tag_Constraint {
  /** unique or primary key constraint */
  TagPkey = 'tag_pkey'
}

/** input type for inserting data into table "tag" */
export type Tag_Insert_Input = {
  id?: Maybe<Scalars['uuid']>,
  tag_articles?: Maybe<Article_Tag_Arr_Rel_Insert_Input>,
  tag_value?: Maybe<Scalars['String']>,
};

/** aggregate max on columns */
export type Tag_Max_Fields = {
  __typename?: 'tag_max_fields',
  tag_value?: Maybe<Scalars['String']>,
};

/** order by max() on columns of table "tag" */
export type Tag_Max_Order_By = {
  tag_value?: Maybe<Order_By>,
};

/** aggregate min on columns */
export type Tag_Min_Fields = {
  __typename?: 'tag_min_fields',
  tag_value?: Maybe<Scalars['String']>,
};

/** order by min() on columns of table "tag" */
export type Tag_Min_Order_By = {
  tag_value?: Maybe<Order_By>,
};

/** response of any mutation on the table "tag" */
export type Tag_Mutation_Response = {
  __typename?: 'tag_mutation_response',
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'],
  /** data of the affected rows by the mutation */
  returning: Array<Tag>,
};

/** input type for inserting object relation for remote table "tag" */
export type Tag_Obj_Rel_Insert_Input = {
  data: Tag_Insert_Input,
  on_conflict?: Maybe<Tag_On_Conflict>,
};

/** on conflict condition type for table "tag" */
export type Tag_On_Conflict = {
  constraint: Tag_Constraint,
  update_columns: Array<Tag_Update_Column>,
  where?: Maybe<Tag_Bool_Exp>,
};

/** ordering options when selecting data from "tag" */
export type Tag_Order_By = {
  articles_aggregate?: Maybe<Tag_Articles_View_Aggregate_Order_By>,
  id?: Maybe<Order_By>,
  tag_articles_aggregate?: Maybe<Article_Tag_Aggregate_Order_By>,
  tag_value?: Maybe<Order_By>,
};

/** select columns of table "tag" */
export enum Tag_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TagValue = 'tag_value'
}

/** input type for updating data in table "tag" */
export type Tag_Set_Input = {
  id?: Maybe<Scalars['uuid']>,
  tag_value?: Maybe<Scalars['String']>,
};

/** update columns of table "tag" */
export enum Tag_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TagValue = 'tag_value'
}

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
