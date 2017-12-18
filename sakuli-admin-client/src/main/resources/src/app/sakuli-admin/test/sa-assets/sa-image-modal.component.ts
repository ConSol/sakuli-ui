import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, Optional} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalAware} from "../../../sweetest-components/components/presentation/modal/sc-modal.service";

interface ImageModalState {
  images: string[],
  index: number;
  image: { name: string, link: string, path: string }
}

@Component({
  selector: 'sa-image-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-header">
      {{state?.image?.name}}
    </div>
    <div class="modal-body">
      <img [src]="state?.image?.link"/>
    </div>
    <div class="modal-footer d-flex justify-content-between">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" (click)="previous()" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" (click)="next()" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
      <button type="button" class="btn btn-secondary" (click)="activeModal.close()">&times;</button>
    </div>
  `,
  styles: [`
    .modal-body {
      align-items: center;
      justify-content: center;
      align-content: center;
      text-align: center;
    }

    ul.pagination {
      margin: 0;
    }
  `]
})
export class SaImageModalComponent implements OnInit, ModalAware {
  getActiveModal(): NgbActiveModal {
    return this.activeModal;
  }
  @Input() images: string[];
  @Input() selected: string;
  @Input() basePath: string;

  state: ImageModalState;

  @HostListener('document:keyup', ['$event'])
  handleKeyUp($event: KeyboardEvent) {
    if($event.which === 39) {
      this.next();
    }
    if($event.which === 37) {
      this.previous();
    }
  }

  constructor(
    @Optional() public activeModal: NgbActiveModal) {
  }

  setState(action: number) {
    const {state} = this;
    const index = state.index += action;
    const image = this.images[index %  this.images.length];
    this.state = ({...state,
      image: {
        name: image.split('/').pop(),
        link: `${this.basePath}${image}`,
        path: image.split('/').slice(0,-1).join('/')
      },
      index
    });
  }

  ngOnInit() {
    this.state = {
      index: 0,
      images: this.images,
      image: null
    };
    const nextIdx = this.images.indexOf(this.selected) || 0;
    this.setState(nextIdx)
  }

  next() {
    this.setState(+1)
  }

  previous() {
    this.setState(-1);
  }


}
