/**
 * ViewModel sits behind the UI layer. It exposes data needed by a View.
 * A ViewModel might be looked upon as more of a Model than a View,
 * as it handles most of the View's display logic.
 * The ViewModel exposes methods for helping to maintain
 * the View's state, update the model based on the action's on
 * a View and trigger events on the View.
 * Views and ViewModels communicate using data-bindings and events.
 * Views handle their own user-interface events, mapping them to the ViewModel as necessary.
 */

//TODO: focus on automating UI bindings ... bind functions to ViewModel observables,
//      which are executed anytime the observable changes
//      applyBindings(viewModel, node);

interface iViewModel {

  //view: iView

}