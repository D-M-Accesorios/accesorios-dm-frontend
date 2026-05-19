import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product.model';
import { Category, Material, ProductService } from '../../services/product.service';
import { AdminOrder, AdminOrdersService, OrderStatus } from '../../services/admin-orders.service';
import { AdminEmployee, AdminUsersService } from '../../services/admin-users.service';
import { AdminRole, AdminRolesService } from '../../services/admin-roles.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  materials: Material[] = [];

  orders: AdminOrder[] = [];
  orderStatuses: OrderStatus[] = [];

  employees: AdminEmployee[] = [];
  roles: AdminRole[] = [];

  activeSection = 'productos';

  editingProductId: string | null = null;
  editingEmployeeId: number | null = null;
  editingRoleId: number | null = null;

  isLoading = false;
  isLoadingOrders = false;
  isUpdatingOrder = false;

  successMessage = '';
  errorMessage = '';
  ordersMessage = '';
  usersMessage = '';
  rolesMessage = '';

  selectedImageFile: File | null = null;
  previewImage = '';

  newProduct = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    idCategoria: 0,
    idMaterial: 0
  };

  employeeForm = {
    nombre: '',
    correo: '',
    password: '',
    id_rol: 0,
    estado: true
  };

  roleForm = {
    nombre: '',
    descripcion: ''
  };

  constructor(
    private readonly productService: ProductService,
    private readonly adminOrdersService: AdminOrdersService,
    private readonly adminUsersService: AdminUsersService,
    private readonly adminRolesService: AdminRolesService
  ) {}
  get currentUserRole(): string {
  const user = localStorage.getItem('admin_user');

  if (!user) {
    return '';
  }

  return String(JSON.parse(user).rol ?? '').trim().toUpperCase();
}

get isAdminUser(): boolean {
  return this.currentUserRole === 'ADMIN';
}
get canManageProducts(): boolean {
  return ['ADMIN', 'VENDEDOR', 'ASESOR DE VENTAS'].includes(this.currentUserRole);
}

get canManageOrders(): boolean {
  return ['ADMIN', 'VENDEDOR', 'ASESOR DE VENTAS', 'BODEGUERO'].includes(this.currentUserRole);
}
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadMaterials();
    this.loadOrders();
    this.loadOrderStatuses();
    this.loadEmployees();
    this.loadRoles();
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;

        this.products.forEach((product, index) => {
          this.productService.getProductById(product.id).subscribe({
            next: (detail) => {
              if (!detail) return;

              this.products[index] = {
                ...this.products[index],
                stock: detail.stock,
                material: detail.material,
                category: detail.category,
                description: detail.description
              };
            }
          });
        });
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar los productos.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  loadMaterials(): void {
    this.productService.getMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
      }
    });
  }

  loadOrders(): void {
    this.isLoadingOrders = true;

    this.adminOrdersService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.pedidos;
        this.isLoadingOrders = false;
      },
      error: (error) => {
        console.error('Error cargando pedidos:', error);
        this.isLoadingOrders = false;
      }
    });
  }

  loadOrderStatuses(): void {
    this.adminOrdersService.getStatuses().subscribe({
      next: (statuses) => {
        this.orderStatuses = statuses;
      },
      error: (error) => {
        console.error('Error cargando estados:', error);
      }
    });
  }

  updateOrderStatus(orderId: number, statusId: string): void {
    if (!statusId) return;

    this.ordersMessage = '';
    this.isUpdatingOrder = true;

    this.adminOrdersService.updateOrderStatus(orderId, Number(statusId)).subscribe({
      next: () => {
        this.ordersMessage = 'Estado actualizado correctamente.';
        this.isUpdatingOrder = false;
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error actualizando estado:', error);
        this.ordersMessage = 'No fue posible actualizar el estado.';
        this.isUpdatingOrder = false;
      }
    });
  }

  loadEmployees(): void {
    this.adminUsersService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error cargando empleados:', error);
        this.usersMessage = 'No fue posible cargar empleados.';
      }
    });
  }

  saveEmployee(): void {
    this.usersMessage = '';

    if (
      !this.employeeForm.nombre.trim() ||
      !this.employeeForm.correo.trim() ||
      Number(this.employeeForm.id_rol) <= 0
    ) {
      this.usersMessage = 'Completa nombre, correo y rol.';
      return;
    }

    if (!this.editingEmployeeId && !this.employeeForm.password.trim()) {
      this.usersMessage = 'La contraseña es obligatoria para crear empleado.';
      return;
    }

    const employee = {
      nombre: this.employeeForm.nombre,
      correo: this.employeeForm.correo,
      id_rol: Number(this.employeeForm.id_rol),
      estado: this.employeeForm.estado,
      ...(this.employeeForm.password.trim()
        ? { password: this.employeeForm.password }
        : {})
    };

    if (this.editingEmployeeId) {
      this.adminUsersService.updateEmployee(this.editingEmployeeId, employee).subscribe({
        next: () => {
          this.usersMessage = 'Empleado actualizado correctamente.';
          this.resetEmployeeForm();
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error actualizando empleado:', error);
          this.usersMessage = 'No fue posible actualizar el empleado.';
        }
      });

      return;
    }

    this.adminUsersService.createEmployee(employee).subscribe({
      next: () => {
        this.usersMessage = 'Empleado creado correctamente.';
        this.resetEmployeeForm();
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error creando empleado:', error);
        this.usersMessage = 'No fue posible crear el empleado.';
      }
    });
  }

  editEmployee(employee: AdminEmployee): void {
    this.editingEmployeeId = employee.id_empleado;

    this.employeeForm = {
      nombre: employee.nombre,
      correo: employee.correo,
      password: '',
      id_rol: employee.id_rol,
      estado: employee.estado
    };
  }

  toggleEmployeeStatus(employee: AdminEmployee): void {
    this.adminUsersService.toggleEmployeeStatus(employee.id_empleado).subscribe({
      next: () => {
        this.usersMessage = 'Estado del empleado actualizado.';
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error cambiando estado:', error);
        this.usersMessage = 'No fue posible cambiar el estado.';
      }
    });
  }

  deleteEmployee(employee: AdminEmployee): void {
    const confirmDelete = confirm(`¿Eliminar empleado "${employee.nombre}"?`);

    if (!confirmDelete) return;

    this.adminUsersService.deleteEmployee(employee.id_empleado).subscribe({
      next: () => {
        this.usersMessage = 'Empleado eliminado correctamente.';
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error eliminando empleado:', error);
        this.usersMessage = 'No fue posible eliminar el empleado.';
      }
    });
  }

  resetEmployeeForm(): void {
    this.editingEmployeeId = null;

    this.employeeForm = {
      nombre: '',
      correo: '',
      password: '',
      id_rol: 0,
      estado: true
    };
  }

  loadRoles(): void {
    this.adminRolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error cargando roles:', error);
        this.rolesMessage = 'No fue posible cargar roles.';
      }
    });
  }

  saveRole(): void {
    this.rolesMessage = '';

    if (!this.roleForm.nombre.trim()) {
      this.rolesMessage = 'El nombre del rol es obligatorio.';
      return;
    }

    const role = {
      nombre: this.roleForm.nombre,
      descripcion: this.roleForm.descripcion
    };

    if (this.editingRoleId) {
      this.adminRolesService.updateRole(this.editingRoleId, role).subscribe({
        next: () => {
          this.rolesMessage = 'Rol actualizado correctamente.';
          this.resetRoleForm();
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error actualizando rol:', error);
          this.rolesMessage = 'No fue posible actualizar el rol.';
        }
      });

      return;
    }

    this.adminRolesService.createRole(role).subscribe({
      next: () => {
        this.rolesMessage = 'Rol creado correctamente.';
        this.resetRoleForm();
        this.loadRoles();
      },
      error: (error) => {
        console.error('Error creando rol:', error);
        this.rolesMessage = 'No fue posible crear el rol.';
      }
    });
  }

  editRole(role: AdminRole): void {
    this.editingRoleId = role.id_rol;

    this.roleForm = {
      nombre: role.nombre,
      descripcion: role.descripcion ?? ''
    };
  }

  deleteRole(role: AdminRole): void {
    const confirmDelete = confirm(`¿Eliminar rol "${role.nombre}"?`);

    if (!confirmDelete) return;

    this.adminRolesService.deleteRole(role.id_rol).subscribe({
      next: () => {
        this.rolesMessage = 'Rol eliminado correctamente.';
        this.loadRoles();
      },
      error: (error) => {
        console.error('Error eliminando rol:', error);
        this.rolesMessage = 'No fue posible eliminar el rol.';
      }
    });
  }

  resetRoleForm(): void {
    this.editingRoleId = null;

    this.roleForm = {
      nombre: '',
      descripcion: ''
    };
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedImageFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  saveProduct(): void {
    this.clearMessages();

    if (!this.isFormValid()) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      return;
    }

    const product = this.buildProductRequest();

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, product).subscribe({
        next: () => {
          if (this.selectedImageFile) {
            this.uploadImageAndFinish(this.editingProductId!, 'Producto actualizado correctamente.');
            return;
          }

          this.successMessage = 'Producto actualizado correctamente.';
          this.resetForm();
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error actualizando producto:', error);
          this.errorMessage = 'No fue posible actualizar el producto.';
        }
      });

      return;
    }

    this.productService.createProduct(product).subscribe({
      next: (response: any) => {
        const productId = String(response.idProducto ?? response.id ?? '');

        if (this.selectedImageFile && productId) {
          this.uploadImageAndFinish(productId, 'Producto creado correctamente.');
          return;
        }

        this.successMessage = 'Producto creado correctamente.';
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error creando producto:', error);
        this.errorMessage = 'No fue posible crear el producto.';
      }
    });
  }

  editProduct(product: Product): void {
    this.clearMessages();

    this.productService.getProductById(product.id).subscribe({
      next: (detail: Product | null) => {
        if (!detail) return;

        this.editingProductId = detail.id;

        this.newProduct = {
          nombre: detail.name,
          descripcion: detail.description,
          precio: Number(detail.price),
          stock: Number(detail.stock),
          idCategoria: this.getCategoryIdByName(detail.category),
          idMaterial: this.getMaterialIdByName(detail.material)
        };

        this.previewImage = detail.imageUrl;
        this.selectedImageFile = null;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error cargando producto:', error);
        this.errorMessage = 'No fue posible cargar el producto para edición.';
      }
    });
  }

  deleteProduct(product: Product): void {
    const confirmDelete = confirm(`¿Eliminar el producto "${product.name}"?`);

    if (!confirmDelete) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado correctamente.';
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error eliminando producto:', error);
        this.errorMessage = 'No fue posible eliminar el producto.';
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  private buildProductRequest() {
    return {
      nombre: this.newProduct.nombre,
      descripcion: this.newProduct.descripcion,
      precio: Number(this.newProduct.precio),
      stock: Number(this.newProduct.stock),
      categoria: {
        idCategoria: Number(this.newProduct.idCategoria)
      },
      material: {
        idMaterial: Number(this.newProduct.idMaterial)
      },
      estado: true
    };
  }

  private uploadImageAndFinish(productId: string, message: string): void {
    if (!this.selectedImageFile) return;

    this.productService.uploadProductImage(productId, this.selectedImageFile).subscribe({
      next: () => {
        this.successMessage = message;
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error subiendo imagen:', error);
        this.errorMessage = 'El producto se guardó, pero la imagen no pudo subirse.';
        this.loadProducts();
      }
    });
  }

  private getCategoryIdByName(categoryName?: string): number {
    const category = this.categories.find((item) => item.nombre === categoryName);
    return category?.idCategoria ?? 0;
  }

  private getMaterialIdByName(materialName?: string): number {
    const material = this.materials.find((item) => item.nombre === materialName);
    return material?.idMaterial ?? 0;
  }

  private isFormValid(): boolean {
    return (
      !!this.newProduct.nombre.trim() &&
      !!this.newProduct.descripcion.trim() &&
      Number(this.newProduct.precio) > 0 &&
      Number(this.newProduct.stock) > 0 &&
      Number(this.newProduct.idCategoria) > 0 &&
      Number(this.newProduct.idMaterial) > 0
    );
  }

  private resetForm(): void {
    this.editingProductId = null;
    this.selectedImageFile = null;
    this.previewImage = '';

    this.newProduct = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      idCategoria: 0,
      idMaterial: 0
    };
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}