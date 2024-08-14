import { IToDoModel } from '../types';
import { IViewItem, IViewItemConstructor } from './Item';
import { IForm, IFormConstructor } from './Form';
import { IPage } from './Page';
import { IPopup } from './Popup';

export class ItemPresenter {
	protected itemTemplate: HTMLTemplateElement;
	protected formTemplate: HTMLTemplateElement;
	protected todoForm: IForm;
	protected todoEditForm: IForm;
    protected handleSubmitEditForm: (data: {value: string}) => void;

	constructor(
		protected model: IToDoModel,
		protected formConstructor: IFormConstructor,
		protected viewPageContainer: IPage,
		protected viewItemConstructor: IViewItemConstructor,
		protected modal: IPopup,
        ) {
            this.itemTemplate = document.querySelector(
                '#todo-item-template'
            ) as HTMLTemplateElement;
            this.formTemplate = document.querySelector(
                '#todo-form-template'
            ) as HTMLTemplateElement;
        }

        init() {
            this.todoForm = new this.formConstructor(this.formTemplate)
            this.todoForm.buttonText = 'Добавить';
            this.todoForm.placeholder = 'Следующее дело';
            this.viewPageContainer.formContainer = this.todoForm.render();
            this.todoEditForm = new this.formConstructor(this.formTemplate);
            this.todoEditForm.buttonText = 'Изменить';
            this.todoEditForm.placeholder = 'Новое название';

            this.model.on('changed', () => {
                this.renderView();
            })

            this.todoForm.on('submit', this.handleSubmitForm.bind(this))
            this.todoEditForm.on('submit', (data: {value: string}) => this.handleSubmitEditForm(data))
            }

        handleSubmitForm(data: {value: string}) {
            this.model.addItem(data.value);
            this.todoForm.clearValue();
        }
    
        handleCopyItem(item: {id: string}) {
            const copyedItem = this.model.getItem(item.id)
            this.model.addItem(copyedItem.name);
        }
    
        handleDeleteItem(item: {id: string}) {
            this.model.removeItem(item.id);
        }    

        handleEditItem(item: {id: string}) {
            const editedItem = this.model.getItem(item.id)
            this.todoEditForm.setValue(editedItem.name);
            this.modal.content = this.todoEditForm.render();
            this.handleSubmitEditForm = (data: {value: string}) => {
                this.model.editItem(item.id, data.value);
                this.todoEditForm.clearValue();
                this.modal.close();   
            }
            this.modal.open();
        }
        
        renderView() {
            const itemList = this.model.items.map((item) => {
                const todoItem = new this.viewItemConstructor(this.itemTemplate);
    			todoItem.on('copy', this.handleCopyItem.bind(this))
    			todoItem.on('delete', this.handleDeleteItem.bind(this))
                todoItem.on('edit', this.handleEditItem.bind(this))
                const itemElement = todoItem.render(item);
                return itemElement;
            }).reverse();
    
            this.viewPageContainer.todoContainer = itemList;
        }
    }
