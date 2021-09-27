export interface Factory<Product> {
    create(): Promise<Product> | Product;
    change(product: Product): Promise<void> | void;
}
